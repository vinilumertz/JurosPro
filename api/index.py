Perfeito! Vou te mostrar o código completo do backend:
Action: file_editor view /app/backend/server.py
Observation: /app/backend/server.py:
1|from fastapi import FastAPI, APIRouter, HTTPException
2|from dotenv import load_dotenv
3|from starlette.middleware.cors import CORSMiddleware
4|from motor.motor_asyncio import AsyncIOMotorClient
5|import os
6|import logging
7|from pathlib import Path
8|from pydantic import BaseModel, Field, ConfigDict
9|from typing import List, Optional
10|import uuid
11|from datetime import datetime, timezone, timedelta
12|from decimal import Decimal
13|
14|ROOT_DIR = Path(__file__).parent
15|load_dotenv(ROOT_DIR / '.env')
16|
17|# MongoDB connection
18|mongo_url = os.environ['MONGO_URL']
19|client = AsyncIOMotorClient(mongo_url)
20|db = client[os.environ['DB_NAME']]
21|
22|# Create the main app without a prefix
23|app = FastAPI()
24|
25|# Create a router with the /api prefix
26|api_router = APIRouter(prefix="/api")
27|
28|# ==================== MODELS ====================
29|
30|class Client(BaseModel):
31|    model_config = ConfigDict(extra="ignore")
32|    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
33|    name: str
34|    cpf: str
35|    phone: str
36|    email: Optional[str] = None
37|    address: Optional[str] = None
38|    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
39|
40|class ClientCreate(BaseModel):
41|    name: str
42|    cpf: str
43|    phone: str
44|    email: Optional[str] = None
45|    address: Optional[str] = None
46|
47|class Loan(BaseModel):
48|    model_config = ConfigDict(extra="ignore")
49|    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
50|    client_id: str
51|    client_name: str
52|    amount: float
53|    interest_rate: float
54|    num_installments: int
55|    calculation_type: str  # "simple", "compound", "price", "sac"
56|    loan_date: str
57|    status: str = "active"  # active, paid, overdue
58|    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
59|
60|class LoanCreate(BaseModel):
61|    client_id: str
62|    amount: float
63|    interest_rate: float
64|    num_installments: int
65|    calculation_type: str
66|    loan_date: str
67|
68|class Installment(BaseModel):
69|    model_config = ConfigDict(extra="ignore")
70|    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
71|    loan_id: str
72|    installment_number: int
73|    due_date: str
74|    amount: float
75|    principal: float
76|    interest: float
77|    status: str = "pending"  # pending, paid, overdue, partial
78|    paid_amount: float = 0.0
79|    payment_date: Optional[str] = None
80|    late_fee: float = 0.0
81|
82|class Payment(BaseModel):
83|    model_config = ConfigDict(extra="ignore")
84|    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
85|    installment_id: str
86|    loan_id: str
87|    amount: float
88|    payment_date: str
89|    notes: Optional[str] = None
90|
91|class PaymentCreate(BaseModel):
92|    installment_id: str
93|    amount: float
94|    payment_date: str
95|    notes: Optional[str] = None
96|
97|class DashboardStats(BaseModel):
98|    total_loaned: float
99|    total_to_receive: float
100|    total_received: float
101|    total_overdue: float
102|    active_loans: int
103|    active_clients: int
104|
105|# ==================== HELPER FUNCTIONS ====================
106|
107|def calculate_installments(amount: float, interest_rate: float, num_installments: int, 
108|                          calculation_type: str, start_date: str):
109|    """Calculate installment amounts based on calculation type"""
110|    installments = []
111|    start = datetime.fromisoformat(start_date)
112|    
113|    if calculation_type == "simple":
114|        # Juros simples: Total = Principal + (Principal * Taxa * Tempo)
115|        total_interest = amount * (interest_rate / 100) * num_installments
116|        total_amount = amount + total_interest
117|        installment_amount = total_amount / num_installments
118|        
119|        for i in range(1, num_installments + 1):
120|            due_date = start + timedelta(days=30 * i)
121|            installments.append({
122|                "installment_number": i,
123|                "due_date": due_date.isoformat(),
124|                "amount": round(installment_amount, 2),
125|                "principal": round(amount / num_installments, 2),
126|                "interest": round(total_interest / num_installments, 2)
127|            })
128|    
129|    elif calculation_type == "compound":
130|        # Juros compostos
131|        monthly_rate = interest_rate / 100
132|        total_amount = amount * ((1 + monthly_rate) ** num_installments)
133|        installment_amount = total_amount / num_installments
134|        
135|        for i in range(1, num_installments + 1):
136|            due_date = start + timedelta(days=30 * i)
137|            installments.append({
138|                "installment_number": i,
139|                "due_date": due_date.isoformat(),
140|                "amount": round(installment_amount, 2),
141|                "principal": round(amount / num_installments, 2),
142|                "interest": round((total_amount - amount) / num_installments, 2)
143|            })
144|    
145|    elif calculation_type == "price":
146|        # Tabela Price (parcelas fixas)
147|        monthly_rate = interest_rate / 100
148|        if monthly_rate == 0:
149|            installment_amount = amount / num_installments
150|        else:
151|            installment_amount = amount * (monthly_rate * ((1 + monthly_rate) ** num_installments)) / \
152|                               (((1 + monthly_rate) ** num_installments) - 1)
153|        
154|        balance = amount
155|        for i in range(1, num_installments + 1):
156|            due_date = start + timedelta(days=30 * i)
157|            interest_part = balance * monthly_rate
158|            principal_part = installment_amount - interest_part
159|            balance -= principal_part
160|            
161|            installments.append({
162|                "installment_number": i,
163|                "due_date": due_date.isoformat(),
164|                "amount": round(installment_amount, 2),
165|                "principal": round(principal_part, 2),
166|                "interest": round(interest_part, 2)
167|            })
168|    
169|    elif calculation_type == "sac":
170|        # SAC (Sistema de Amortização Constante)
171|        monthly_rate = interest_rate / 100
172|        principal_part = amount / num_installments
173|        balance = amount
174|        
175|        for i in range(1, num_installments + 1):
176|            due_date = start + timedelta(days=30 * i)
177|            interest_part = balance * monthly_rate
178|            installment_amount = principal_part + interest_part
179|            balance -= principal_part
180|            
181|            installments.append({
182|                "installment_number": i,
183|                "due_date": due_date.isoformat(),
184|                "amount": round(installment_amount, 2),
185|                "principal": round(principal_part, 2),
186|                "interest": round(interest_part, 2)
187|            })
188|    
189|    return installments
190|
191|# ==================== CLIENT ROUTES ====================
192|
193|@api_router.post("/clients", response_model=Client)
194|async def create_client(client: ClientCreate):
195|    client_obj = Client(**client.model_dump())
196|    doc = client_obj.model_dump()
197|    await db.clients.insert_one(doc)
198|    return client_obj
199|
200|@api_router.get("/clients", response_model=List[Client])
201|async def get_clients():
202|    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
203|    return clients
204|
205|@api_router.get("/clients/{client_id}", response_model=Client)
206|async def get_client(client_id: str):
207|    client = await db.clients.find_one({"id": client_id}, {"_id": 0})
208|    if not client:
209|        raise HTTPException(status_code=404, detail="Cliente não encontrado")
210|    return client
211|
212|@api_router.put("/clients/{client_id}", response_model=Client)
213|async def update_client(client_id: str, client_update: ClientCreate):
214|    result = await db.clients.update_one(
215|        {"id": client_id},
216|        {"$set": client_update.model_dump()}
217|    )
218|    if result.matched_count == 0:
219|        raise HTTPException(status_code=404, detail="Cliente não encontrado")
220|    
221|    updated_client = await db.clients.find_one({"id": client_id}, {"_id": 0})
222|    return updated_client
223|
224|@api_router.delete("/clients/{client_id}")
225|async def delete_client(client_id: str):
226|    result = await db.clients.delete_one({"id": client_id})
227|    if result.deleted_count == 0:
228|        raise HTTPException(status_code=404, detail="Cliente não encontrado")
229|    return {"message": "Cliente deletado com sucesso"}
230|
231|# ==================== LOAN ROUTES ====================
232|
233|@api_router.post("/loans", response_model=Loan)
234|async def create_loan(loan: LoanCreate):
235|    # Get client info
236|    client = await db.clients.find_one({"id": loan.client_id}, {"_id": 0})
237|    if not client:
238|        raise HTTPException(status_code=404, detail="Cliente não encontrado")
239|    
240|    # Create loan
241|    loan_data = loan.model_dump()
242|    loan_data["client_name"] = client["name"]
243|    loan_obj = Loan(**loan_data)
244|    doc = loan_obj.model_dump()
245|    await db.loans.insert_one(doc)
246|    
247|    # Generate installments
248|    installments_data = calculate_installments(
249|        loan.amount, loan.interest_rate, loan.num_installments,
250|        loan.calculation_type, loan.loan_date
251|    )
252|    
253|    # Save installments
254|    for inst_data in installments_data:
255|        inst_data["loan_id"] = loan_obj.id
256|        installment = Installment(**inst_data)
257|        await db.installments.insert_one(installment.model_dump())
258|    
259|    return loan_obj
260|
261|@api_router.get("/loans", response_model=List[Loan])
262|async def get_loans():
263|    loans = await db.loans.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
264|    return loans
265|
266|@api_router.get("/loans/{loan_id}", response_model=Loan)
267|async def get_loan(loan_id: str):
268|    loan = await db.loans.find_one({"id": loan_id}, {"_id": 0})
269|    if not loan:
270|        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
271|    return loan
272|
273|@api_router.put("/loans/{loan_id}", response_model=Loan)
274|async def update_loan(loan_id: str, loan_update: LoanCreate):
275|    # Check if loan exists
276|    existing_loan = await db.loans.find_one({"id": loan_id}, {"_id": 0})
277|    if not existing_loan:
278|        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
279|    
280|    # Check if there are any payments made
281|    installments = await db.installments.find({"loan_id": loan_id}, {"_id": 0}).to_list(1000)
282|    has_payments = any(inst["paid_amount"] > 0 for inst in installments)
283|    
284|    if has_payments:
285|        raise HTTPException(
286|            status_code=400, 
287|            detail="Não é possível editar empréstimo com pagamentos já realizados. Você pode alterar apenas o status manualmente."
288|        )
289|    
290|    # Get client info
291|    client = await db.clients.find_one({"id": loan_update.client_id}, {"_id": 0})
292|    if not client:
293|        raise HTTPException(status_code=404, detail="Cliente não encontrado")
294|    
295|    # Update loan
296|    loan_data = loan_update.model_dump()
297|    loan_data["client_name"] = client["name"]
298|    loan_data["id"] = loan_id
299|    loan_data["created_at"] = existing_loan["created_at"]
300|    loan_data["status"] = existing_loan.get("status", "active")
301|    
302|    await db.loans.update_one(
303|        {"id": loan_id},
304|        {"$set": loan_data}
305|    )
306|    
307|    # Delete old installments
308|    await db.installments.delete_many({"loan_id": loan_id})
309|    
310|    # Generate new installments
311|    installments_data = calculate_installments(
312|        loan_update.amount, loan_update.interest_rate, loan_update.num_installments,
313|        loan_update.calculation_type, loan_update.loan_date
314|    )
315|    
316|    # Save new installments
317|    for inst_data in installments_data:
318|        inst_data["loan_id"] = loan_id
319|        installment = Installment(**inst_data)
320|        await db.installments.insert_one(installment.model_dump())
321|    
322|    updated_loan = await db.loans.find_one({"id": loan_id}, {"_id": 0})
323|    return updated_loan
324|
325|@api_router.delete("/loans/{loan_id}")
326|async def delete_loan(loan_id: str):
327|    # Check if loan exists
328|    loan = await db.loans.find_one({"id": loan_id}, {"_id": 0})
329|    if not loan:
330|        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
331|    
332|    # Check if there are any payments made
333|    installments = await db.installments.find({"loan_id": loan_id}, {"_id": 0}).to_list(1000)
334|    has_payments = any(inst["paid_amount"] > 0 for inst in installments)
335|    
336|    if has_payments:
337|        raise HTTPException(
338|            status_code=400, 
339|            detail="Não é possível excluir empréstimo com pagamentos já realizados."
340|        )
341|    
342|    # Delete installments
343|    await db.installments.delete_many({"loan_id": loan_id})
344|    
345|    # Delete loan
346|    result = await db.loans.delete_one({"id": loan_id})
347|    if result.deleted_count == 0:
348|        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
349|    
350|    return {"message": "Empréstimo deletado com sucesso"}
351|
352|@api_router.get("/loans/{loan_id}/installments", response_model=List[Installment])
353|async def get_loan_installments(loan_id: str):
354|    installments = await db.installments.find({"loan_id": loan_id}, {"_id": 0}).sort("installment_number", 1).to_list(1000)
355|    
356|    # Update overdue status
357|    now = datetime.now(timezone.utc).isoformat()
358|    for inst in installments:
359|        if inst["status"] == "pending" and inst["due_date"] < now:
360|            inst["status"] = "overdue"
361|            # Calculate late fee (2% per month)
362|            days_late = (datetime.fromisoformat(now) - datetime.fromisoformat(inst["due_date"])).days
363|            inst["late_fee"] = round(inst["amount"] * 0.02 * (days_late / 30), 2)
364|            await db.installments.update_one(
365|                {"id": inst["id"]},
366|                {"$set": {"status": "overdue", "late_fee": inst["late_fee"]}}
367|            )
368|    
369|    return installments
370|
371|@api_router.get("/clients/{client_id}/loans", response_model=List[Loan])
372|async def get_client_loans(client_id: str):
373|    loans = await db.loans.find({"client_id": client_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
374|    return loans
375|
376|# ==================== PAYMENT ROUTES ====================
377|
378|@api_router.post("/payments", response_model=Payment)
379|async def create_payment(payment: PaymentCreate):
380|    # Get installment
381|    installment = await db.installments.find_one({"id": payment.installment_id}, {"_id": 0})
382|    if not installment:
383|        raise HTTPException(status_code=404, detail="Parcela não encontrada")
384|    
385|    # Create payment record
386|    payment_data = payment.model_dump()
387|    payment_data["loan_id"] = installment["loan_id"]
388|    payment_obj = Payment(**payment_data)
389|    await db.payments.insert_one(payment_obj.model_dump())
390|    
391|    # Update installment
392|    new_paid_amount = installment["paid_amount"] + payment.amount
393|    total_due = installment["amount"] + installment.get("late_fee", 0)
394|    
395|    if new_paid_amount >= total_due:
396|        status = "paid"
397|    else:
398|        status = "partial"
399|    
400|    await db.installments.update_one(
401|        {"id": payment.installment_id},
402|        {"$set": {
403|            "paid_amount": new_paid_amount,
404|            "status": status,
405|            "payment_date": payment.payment_date if status == "paid" else None
406|        }}
407|    )
408|    
409|    # Update loan status
410|    loan_id = installment["loan_id"]
411|    all_installments = await db.installments.find({"loan_id": loan_id}, {"_id": 0}).to_list(1000)
412|    all_paid = all(inst["status"] == "paid" for inst in all_installments)
413|    
414|    if all_paid:
415|        await db.loans.update_one(
416|            {"id": loan_id},
417|            {"$set": {"status": "paid"}}
418|        )
419|    
420|    return payment_obj
421|
422|@api_router.get("/payments/installment/{installment_id}", response_model=List[Payment])
423|async def get_installment_payments(installment_id: str):
424|    payments = await db.payments.find({"installment_id": installment_id}, {"_id": 0}).to_list(1000)
425|    return payments
426|
427|# ==================== DASHBOARD ROUTES ====================
428|
429|@api_router.get("/dashboard/stats", response_model=DashboardStats)
430|async def get_dashboard_stats():
431|    # Get all loans
432|    loans = await db.loans.find({}, {"_id": 0}).to_list(10000)
433|    installments = await db.installments.find({}, {"_id": 0}).to_list(10000)
434|    
435|    total_loaned = sum(loan["amount"] for loan in loans)
436|    
437|    total_to_receive = 0
438|    total_received = 0
439|    total_overdue = 0
440|    
441|    for inst in installments:
442|        if inst["status"] in ["pending", "partial", "overdue"]:
443|            remaining = inst["amount"] + inst.get("late_fee", 0) - inst["paid_amount"]
444|            total_to_receive += remaining
445|            if inst["status"] == "overdue":
446|                total_overdue += remaining
447|        total_received += inst["paid_amount"]
448|    
449|    active_loans = len([l for l in loans if l["status"] == "active"])
450|    active_clients = await db.clients.count_documents({})
451|    
452|    return DashboardStats(
453|        total_loaned=round(total_loaned, 2),
454|        total_to_receive=round(total_to_receive, 2),
455|        total_received=round(total_received, 2),
456|        total_overdue=round(total_overdue, 2),
457|        active_loans=active_loans,
458|        active_clients=active_clients
459|    )
460|
461|@api_router.get("/dashboard/upcoming")
462|async def get_upcoming_payments():
463|    now = datetime.now(timezone.utc)
464|    next_30_days = now + timedelta(days=30)
465|    
466|    installments = await db.installments.find({
467|        "status": {"$in": ["pending", "partial"]},
468|        "due_date": {"$gte": now.isoformat(), "$lte": next_30_days.isoformat()}
469|    }, {"_id": 0}).sort("due_date", 1).to_list(100)
470|    
471|    # Enrich with loan and client data
472|    result = []
473|    for inst in installments:
474|        loan = await db.loans.find_one({"id": inst["loan_id"]}, {"_id": 0})
475|        if loan:
476|            result.append({
477|                **inst,
478|                "client_name": loan["client_name"]
479|            })
480|    
481|    return result
482|
483|@api_router.get("/dashboard/overdue")
484|async def get_overdue_clients():
485|    # Get all overdue installments
486|    overdue_installments = await db.installments.find({
487|        "status": "overdue"
488|    }, {"_id": 0}).to_list(1000)
489|    
490|    # Group by client
491|    client_debts = {}
492|    for inst in overdue_installments:
493|        loan = await db.loans.find_one({"id": inst["loan_id"]}, {"_id": 0})
494|        if loan:
495|            client_id = loan["client_id"]
496|            if client_id not in client_debts:
497|                client_debts[client_id] = {
498|                    "client_id": client_id,
499|                    "client_name": loan["client_name"],
500|                    "overdue_amount": 0,
501|                    "overdue_count": 0
502|                }
503|            
504|            remaining = inst["amount"] + inst.get("late_fee", 0) - inst["paid_amount"]
505|            client_debts[client_id]["overdue_amount"] += remaining
506|            client_debts[client_id]["overdue_count"] += 1
507|    
508|    return list(client_debts.values())
509|
510|# ==================== SETUP ====================
511|
512|@api_router.get("/")
513|async def root():
514|    return {"message": "API de Gestão de Empréstimos"}
515|
516|# Include the router in the main app
517|app.include_router(api_router)
518|
519|app.add_middleware(
520|    CORSMiddleware,
521|    allow_credentials=True,
522|    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
523|    allow_methods=["*"],
524|    allow_headers=["*"],
525|)
526|
527|# Configure logging
528|logging.basicConfig(
529|    level=logging.INFO,
530|    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
531|)
532|logger = logging.getLogger(__name__)
533|
534|@app.on_event("shutdown")
535|async def shutdown_db_client():
536|    client.close()
537|
