🎉 **Perfeito! Agora vamos para os arquivos do React!**

---

## 📄 **ARQUIVO 8: src/App.js** (IMPORTANTE - arquivo grande)

Este é o arquivo principal do seu aplicativo!

### **No GitHub:**
1. Clique em "Add file" → "Create new file"
2. Nome: `src/App.js`
3. Cole este código:
Action: file_editor view /app/frontend/src/App.js
Observation: /app/frontend/src/App.js:
1|import { useState, useEffect } from "react";
2|import "@/App.css";
3|import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
4|import axios from "axios";
5|import { Toaster, toast } from "sonner";
6|import { Button } from "@/components/ui/button";
7|import { Input } from "@/components/ui/input";
8|import { Label } from "@/components/ui/label";
9|import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
10|import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
11|import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
12|import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
13|import { Badge } from "@/components/ui/badge";
14|import { Separator } from "@/components/ui/separator";
15|import { DollarSign, Users, TrendingUp, AlertCircle, Calendar, Plus, Search } from "lucide-react";
16|
17|const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
18|const API = `${BACKEND_URL}/api`;
19|
20|// ==================== COMPONENTS ====================
21|
22|const Dashboard = () => {
23|  const [stats, setStats] = useState(null);
24|  const [upcoming, setUpcoming] = useState([]);
25|  const [overdue, setOverdue] = useState([]);
26|  const navigate = useNavigate();
27|
28|  useEffect(() => {
29|    loadDashboard();
30|  }, []);
31|
32|  const loadDashboard = async () => {
33|    try {
34|      const [statsRes, upcomingRes, overdueRes] = await Promise.all([
35|        axios.get(`${API}/dashboard/stats`),
36|        axios.get(`${API}/dashboard/upcoming`),
37|        axios.get(`${API}/dashboard/overdue`)
38|      ]);
39|      setStats(statsRes.data);
40|      setUpcoming(upcomingRes.data);
41|      setOverdue(overdueRes.data);
42|    } catch (error) {
43|      toast.error("Erro ao carregar dashboard");
44|    }
45|  };
46|
47|  const formatCurrency = (value) => {
48|    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
49|  };
50|
51|  const formatDate = (dateStr) => {
52|    return new Date(dateStr).toLocaleDateString('pt-BR');
53|  };
54|
55|  if (!stats) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
56|
57|  return (
58|    <div className="space-y-6" data-testid="dashboard-page">
59|      <div>
60|        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
61|        <p className="text-muted-foreground">Visão geral dos seus empréstimos</p>
62|      </div>
63|
64|      {/* Stats Cards */}
65|      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
66|        <Card data-testid="stat-card-loaned">
67|          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
68|            <CardTitle className="text-sm font-medium">Total Emprestado</CardTitle>
69|            <DollarSign className="h-4 w-4 text-muted-foreground" />
70|          </CardHeader>
71|          <CardContent>
72|            <div className="text-2xl font-bold">{formatCurrency(stats.total_loaned)}</div>
73|            <p className="text-xs text-muted-foreground">{stats.active_loans} empréstimos ativos</p>
74|          </CardContent>
75|        </Card>
76|
77|        <Card data-testid="stat-card-receive">
78|          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
79|            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
80|            <TrendingUp className="h-4 w-4 text-muted-foreground" />
81|          </CardHeader>
82|          <CardContent>
83|            <div className="text-2xl font-bold">{formatCurrency(stats.total_to_receive)}</div>
84|            <p className="text-xs text-muted-foreground">Pendente de pagamento</p>
85|          </CardContent>
86|        </Card>
87|
88|        <Card data-testid="stat-card-received">
89|          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
90|            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
91|            <DollarSign className="h-4 w-4 text-green-600" />
92|          </CardHeader>
93|          <CardContent>
94|            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_received)}</div>
95|            <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
96|          </CardContent>
97|        </Card>
98|
99|        <Card data-testid="stat-card-overdue">
100|          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
101|            <CardTitle className="text-sm font-medium">Valores em Atraso</CardTitle>
102|            <AlertCircle className="h-4 w-4 text-red-600" />
103|          </CardHeader>
104|          <CardContent>
105|            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.total_overdue)}</div>
106|            <p className="text-xs text-muted-foreground">Requer atenção</p>
107|          </CardContent>
108|        </Card>
109|
110|        <Card data-testid="stat-card-clients">
111|          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
112|            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
113|            <Users className="h-4 w-4 text-muted-foreground" />
114|          </CardHeader>
115|          <CardContent>
116|            <div className="text-2xl font-bold">{stats.active_clients}</div>
117|            <p className="text-xs text-muted-foreground">Total de clientes</p>
118|          </CardContent>
119|        </Card>
120|      </div>
121|
122|      {/* Upcoming Payments */}
123|      <Card data-testid="upcoming-payments-card">
124|        <CardHeader>
125|          <CardTitle>Próximos Vencimentos (30 dias)</CardTitle>
126|          <CardDescription>Parcelas com vencimento nos próximos 30 dias</CardDescription>
127|        </CardHeader>
128|        <CardContent>
129|          {upcoming.length === 0 ? (
130|            <p className="text-sm text-muted-foreground">Nenhum vencimento próximo</p>
131|          ) : (
132|            <div className="space-y-4">
133|              {upcoming.map((item) => (
134|                <div key={item.id} className="flex items-center justify-between" data-testid={`upcoming-item-${item.id}`}>
135|                  <div>
136|                    <p className="font-medium">{item.client_name}</p>
137|                    <p className="text-sm text-muted-foreground">
138|                      Parcela {item.installment_number} - Vence em {formatDate(item.due_date)}
139|                    </p>
140|                  </div>
141|                  <div className="text-right">
142|                    <p className="font-bold">{formatCurrency(item.amount)}</p>
143|                  </div>
144|                </div>
145|              ))}
146|            </div>
147|          )}
148|        </CardContent>
149|      </Card>
150|
151|      {/* Overdue Clients */}
152|      {overdue.length > 0 && (
153|        <Card data-testid="overdue-clients-card">
154|          <CardHeader>
155|            <CardTitle>Clientes Inadimplentes</CardTitle>
156|            <CardDescription>Clientes com parcelas em atraso</CardDescription>
157|          </CardHeader>
158|          <CardContent>
159|            <div className="space-y-4">
160|              {overdue.map((item) => (
161|                <div key={item.client_id} className="flex items-center justify-between" data-testid={`overdue-client-${item.client_id}`}>
162|                  <div>
163|                    <p className="font-medium">{item.client_name}</p>
164|                    <p className="text-sm text-muted-foreground">
165|                      {item.overdue_count} parcela(s) em atraso
166|                    </p>
167|                  </div>
168|                  <div className="text-right">
169|                    <p className="font-bold text-red-600">{formatCurrency(item.overdue_amount)}</p>
170|                  </div>
171|                </div>
172|              ))}
173|            </div>
174|          </CardContent>
175|        </Card>
176|      )}
177|    </div>
178|  );
179|};
180|
181|const Clients = () => {
182|  const [clients, setClients] = useState([]);
183|  const [isDialogOpen, setIsDialogOpen] = useState(false);
184|  const [searchTerm, setSearchTerm] = useState("");
185|  const [formData, setFormData] = useState({
186|    name: "",
187|    cpf: "",
188|    phone: "",
189|    email: "",
190|    address: ""
191|  });
192|  const navigate = useNavigate();
193|
194|  useEffect(() => {
195|    loadClients();
196|  }, []);
197|
198|  const loadClients = async () => {
199|    try {
200|      const response = await axios.get(`${API}/clients`);

Action: file_editor view /app/frontend/src/App.js
Observation: /app/frontend/src/App.js:
200|      const response = await axios.get(`${API}/clients`);
201|      setClients(response.data);
202|    } catch (error) {
203|      toast.error("Erro ao carregar clientes");
204|    }
205|  };
206|
207|  const handleSubmit = async (e) => {
208|    e.preventDefault();
209|    try {
210|      await axios.post(`${API}/clients`, formData);
211|      toast.success("Cliente criado com sucesso!");
212|      setIsDialogOpen(false);
213|      setFormData({ name: "", cpf: "", phone: "", email: "", address: "" });
214|      loadClients();
215|    } catch (error) {
216|      toast.error("Erro ao criar cliente");
217|    }
218|  };
219|
220|  const filteredClients = clients.filter(client =>
221|    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
222|    client.cpf.includes(searchTerm)
223|  );
224|
225|  return (
226|    <div className="space-y-6" data-testid="clients-page">
227|      <div className="flex items-center justify-between">
228|        <div>
229|          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
230|          <p className="text-muted-foreground">Gerencie seus clientes</p>
231|        </div>
232|        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
233|          <DialogTrigger asChild>
234|            <Button data-testid="add-client-button">
235|              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
236|            </Button>
237|          </DialogTrigger>
238|          <DialogContent data-testid="add-client-dialog">
239|            <DialogHeader>
240|              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
241|              <DialogDescription>Preencha os dados do cliente</DialogDescription>
242|            </DialogHeader>
243|            <form onSubmit={handleSubmit} className="space-y-4">
244|              <div>
245|                <Label htmlFor="name">Nome *</Label>
246|                <Input
247|                  id="name"
248|                  data-testid="client-name-input"
249|                  value={formData.name}
250|                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
251|                  required
252|                />
253|              </div>
254|              <div>
255|                <Label htmlFor="cpf">CPF *</Label>
256|                <Input
257|                  id="cpf"
258|                  data-testid="client-cpf-input"
259|                  value={formData.cpf}
260|                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
261|                  required
262|                />
263|              </div>
264|              <div>
265|                <Label htmlFor="phone">Telefone *</Label>
266|                <Input
267|                  id="phone"
268|                  data-testid="client-phone-input"
269|                  value={formData.phone}
270|                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
271|                  required
272|                />
273|              </div>
274|              <div>
275|                <Label htmlFor="email">Email</Label>
276|                <Input
277|                  id="email"
278|                  type="email"
279|                  data-testid="client-email-input"
280|                  value={formData.email}
281|                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
282|                />
283|              </div>
284|              <div>
285|                <Label htmlFor="address">Endereço</Label>
286|                <Input
287|                  id="address"
288|                  data-testid="client-address-input"
289|                  value={formData.address}
290|                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
291|                />
292|              </div>
293|              <Button type="submit" className="w-full" data-testid="submit-client-button">
294|                Criar Cliente
295|              </Button>
296|            </form>
297|          </DialogContent>
298|        </Dialog>
299|      </div>
300|
301|      <div className="flex items-center space-x-2">
302|        <Search className="h-4 w-4 text-muted-foreground" />
303|        <Input
304|          placeholder="Buscar por nome ou CPF..."
305|          data-testid="search-client-input"
306|          value={searchTerm}
307|          onChange={(e) => setSearchTerm(e.target.value)}
308|          className="max-w-sm"
309|        />
310|      </div>
311|
312|      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
313|        {filteredClients.map((client) => (
314|          <Card
315|            key={client.id}
316|            data-testid={`client-card-${client.id}`}
317|            className="cursor-pointer hover:shadow-lg transition-shadow"
318|            onClick={() => navigate(`/clients/${client.id}`)}
319|          >
320|            <CardHeader>
321|              <CardTitle>{client.name}</CardTitle>
322|              <CardDescription>CPF: {client.cpf}</CardDescription>
323|            </CardHeader>
324|            <CardContent>
325|              <div className="space-y-1 text-sm">
326|                <p><strong>Telefone:</strong> {client.phone}</p>
327|                {client.email && <p><strong>Email:</strong> {client.email}</p>}
328|                {client.address && <p><strong>Endereço:</strong> {client.address}</p>}
329|              </div>
330|            </CardContent>
331|          </Card>
332|        ))}
333|      </div>
334|    </div>
335|  );
336|};
337|
338|const ClientDetail = () => {
339|  const [client, setClient] = useState(null);
340|  const [loans, setLoans] = useState([]);
341|  const { id } = window.location.pathname.split('/').pop();
342|
343|  useEffect(() => {
344|    loadClientData();
345|  }, []);
346|
347|  const loadClientData = async () => {
348|    try {
349|      const clientId = window.location.pathname.split('/').pop();
350|      const [clientRes, loansRes] = await Promise.all([
351|        axios.get(`${API}/clients/${clientId}`),
352|        axios.get(`${API}/clients/${clientId}/loans`)
353|      ]);
354|      setClient(clientRes.data);
355|      setLoans(loansRes.data);
356|    } catch (error) {
357|      toast.error("Erro ao carregar dados do cliente");
358|    }
359|  };
360|
361|  const formatCurrency = (value) => {
362|    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
363|  };
364|
365|  const formatDate = (dateStr) => {
366|    return new Date(dateStr).toLocaleDateString('pt-BR');
367|  };
368|
369|  if (!client) return <div>Carregando...</div>;
370|
371|  return (
372|    <div className="space-y-6" data-testid="client-detail-page">
373|      <div>
374|        <Button variant="ghost" onClick={() => window.history.back()} data-testid="back-button">
375|          ← Voltar
376|        </Button>
377|        <h2 className="text-3xl font-bold tracking-tight mt-4">{client.name}</h2>
378|        <p className="text-muted-foreground">CPF: {client.cpf}</p>
379|      </div>
380|
381|      <Card>
382|        <CardHeader>
383|          <CardTitle>Informações do Cliente</CardTitle>
384|        </CardHeader>
385|        <CardContent className="space-y-2">
386|          <p><strong>Telefone:</strong> {client.phone}</p>
387|          {client.email && <p><strong>Email:</strong> {client.email}</p>}
388|          {client.address && <p><strong>Endereço:</strong> {client.address}</p>}
389|          <p><strong>Cliente desde:</strong> {formatDate(client.created_at)}</p>
390|        </CardContent>
391|      </Card>
392|
393|      <Card>
394|        <CardHeader>
395|          <CardTitle>Empréstimos</CardTitle>
396|        </CardHeader>
397|        <CardContent>
398|          {loans.length === 0 ? (
399|            <p className="text-sm text-muted-foreground">Nenhum empréstimo registrado</p>
400|          ) : (

Action: file_editor view /app/frontend/src/App.js
Observation: /app/frontend/src/App.js:
400|          ) : (
401|            <div className="space-y-4">
402|              {loans.map((loan) => (
403|                <div key={loan.id} className="border rounded-lg p-4" data-testid={`loan-item-${loan.id}`}>
404|                  <div className="flex items-center justify-between mb-2">
405|                    <div>
406|                      <p className="font-medium">{formatCurrency(loan.amount)}</p>
407|                      <p className="text-sm text-muted-foreground">
408|                        {loan.num_installments}x • Taxa: {loan.interest_rate}% • {loan.calculation_type.toUpperCase()}
409|                      </p>
410|                    </div>
411|                    <Badge variant={loan.status === "paid" ? "success" : loan.status === "active" ? "default" : "destructive"}>
412|                      {loan.status === "paid" ? "Pago" : loan.status === "active" ? "Ativo" : "Atrasado"}
413|                    </Badge>
414|                  </div>
415|                  <p className="text-sm text-muted-foreground">Data: {formatDate(loan.loan_date)}</p>
416|                  <Button
417|                    variant="outline"
418|                    size="sm"
419|                    className="mt-2"
420|                    onClick={() => window.location.href = `/loans/${loan.id}`}
421|                    data-testid={`view-loan-${loan.id}`}
422|                  >
423|                    Ver Detalhes
424|                  </Button>
425|                </div>
426|              ))}
427|            </div>
428|          )}
429|        </CardContent>
430|      </Card>
431|    </div>
432|  );
433|};
434|
435|const Loans = () => {
436|  const [loans, setLoans] = useState([]);
437|  const [clients, setClients] = useState([]);
438|  const [isDialogOpen, setIsDialogOpen] = useState(false);
439|  const [formData, setFormData] = useState({
440|    client_id: "",
441|    amount: "",
442|    interest_rate: "",
443|    num_installments: "",
444|    calculation_type: "price",
445|    loan_date: new Date().toISOString().split('T')[0]
446|  });
447|  const navigate = useNavigate();
448|
449|  useEffect(() => {
450|    loadData();
451|  }, []);
452|
453|  const loadData = async () => {
454|    try {
455|      const [loansRes, clientsRes] = await Promise.all([
456|        axios.get(`${API}/loans`),
457|        axios.get(`${API}/clients`)
458|      ]);
459|      setLoans(loansRes.data);
460|      setClients(clientsRes.data);
461|    } catch (error) {
462|      toast.error("Erro ao carregar dados");
463|    }
464|  };
465|
466|  const handleSubmit = async (e) => {
467|    e.preventDefault();
468|    try {
469|      const payload = {
470|        ...formData,
471|        amount: parseFloat(formData.amount),
472|        interest_rate: parseFloat(formData.interest_rate),
473|        num_installments: parseInt(formData.num_installments),
474|        loan_date: new Date(formData.loan_date).toISOString()
475|      };
476|      await axios.post(`${API}/loans`, payload);
477|      toast.success("Empréstimo criado com sucesso!");
478|      setIsDialogOpen(false);
479|      setFormData({
480|        client_id: "",
481|        amount: "",
482|        interest_rate: "",
483|        num_installments: "",
484|        calculation_type: "price",
485|        loan_date: new Date().toISOString().split('T')[0]
486|      });
487|      loadData();
488|    } catch (error) {
489|      toast.error("Erro ao criar empréstimo");
490|    }
491|  };
492|
493|  const formatCurrency = (value) => {
494|    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
495|  };
496|
497|  const formatDate = (dateStr) => {
498|    return new Date(dateStr).toLocaleDateString('pt-BR');
499|  };
500|
501|  return (
502|    <div className="space-y-6" data-testid="loans-page">
503|      <div className="flex items-center justify-between">
504|        <div>
505|          <h2 className="text-3xl font-bold tracking-tight">Empréstimos</h2>
506|          <p className="text-muted-foreground">Gerencie todos os empréstimos</p>
507|        </div>
508|        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
509|          <DialogTrigger asChild>
510|            <Button data-testid="add-loan-button">
511|              <Plus className="mr-2 h-4 w-4" /> Novo Empréstimo
512|            </Button>
513|          </DialogTrigger>
514|          <DialogContent data-testid="add-loan-dialog">
515|            <DialogHeader>
516|              <DialogTitle>Criar Novo Empréstimo</DialogTitle>
517|              <DialogDescription>Preencha os dados do empréstimo</DialogDescription>
518|            </DialogHeader>
519|            <form onSubmit={handleSubmit} className="space-y-4">
520|              <div>
521|                <Label htmlFor="client_id">Cliente *</Label>
522|                <Select
523|                  value={formData.client_id}
524|                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
525|                  required
526|                >
527|                  <SelectTrigger data-testid="loan-client-select">
528|                    <SelectValue placeholder="Selecione um cliente" />
529|                  </SelectTrigger>
530|                  <SelectContent>
531|                    {clients.map((client) => (
532|                      <SelectItem key={client.id} value={client.id}>
533|                        {client.name}
534|                      </SelectItem>
535|                    ))}
536|                  </SelectContent>
537|                </Select>
538|              </div>
539|              <div>
540|                <Label htmlFor="amount">Valor Emprestado *</Label>
541|                <Input
542|                  id="amount"
543|                  type="number"
544|                  step="0.01"
545|                  data-testid="loan-amount-input"
546|                  value={formData.amount}
547|                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
548|                  required
549|                />
550|              </div>
551|              <div>
552|                <Label htmlFor="interest_rate">Taxa de Juros (% ao mês) *</Label>
553|                <Input
554|                  id="interest_rate"
555|                  type="number"
556|                  step="0.01"
557|                  data-testid="loan-interest-input"
558|                  value={formData.interest_rate}
559|                  onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
560|                  required
561|                />
562|              </div>
563|              <div>
564|                <Label htmlFor="num_installments">Número de Parcelas *</Label>
565|                <Input
566|                  id="num_installments"
567|                  type="number"
568|                  data-testid="loan-installments-input"
569|                  value={formData.num_installments}
570|                  onChange={(e) => setFormData({ ...formData, num_installments: e.target.value })}
571|                  required
572|                />
573|              </div>
574|              <div>
575|                <Label htmlFor="calculation_type">Tipo de Cálculo *</Label>
576|                <Select
577|                  value={formData.calculation_type}
578|                  onValueChange={(value) => setFormData({ ...formData, calculation_type: value })}
579|                >
580|                  <SelectTrigger data-testid="loan-calc-type-select">
581|                    <SelectValue />
582|                  </SelectTrigger>
583|                  <SelectContent>
584|                    <SelectItem value="simple">Juros Simples</SelectItem>
585|                    <SelectItem value="compound">Juros Compostos</SelectItem>
586|                    <SelectItem value="price">Tabela Price</SelectItem>
587|                    <SelectItem value="sac">SAC</SelectItem>
588|                  </SelectContent>
589|                </Select>
590|              </div>
591|              <div>
592|                <Label htmlFor="loan_date">Data do Empréstimo *</Label>
593|                <Input
594|                  id="loan_date"
595|                  type="date"
596|                  data-testid="loan-date-input"
597|                  value={formData.loan_date}
598|                  onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
599|                  required
600|                />

Action: file_editor view /app/frontend/src/App.js
Observation: /app/frontend/src/App.js:
600|                />
601|              </div>
602|              <Button type="submit" className="w-full" data-testid="submit-loan-button">
603|                Criar Empréstimo
604|              </Button>
605|            </form>
606|          </DialogContent>
607|        </Dialog>
608|      </div>
609|
610|      <div className="space-y-4">
611|        {loans.map((loan) => (
612|          <Card
613|            key={loan.id}
614|            data-testid={`loan-card-${loan.id}`}
615|            className="cursor-pointer hover:shadow-lg transition-shadow"
616|            onClick={() => navigate(`/loans/${loan.id}`)}
617|          >
618|            <CardHeader>
619|              <div className="flex items-center justify-between">
620|                <div>
621|                  <CardTitle>{loan.client_name}</CardTitle>
622|                  <CardDescription>
623|                    {formatCurrency(loan.amount)} • {loan.num_installments}x de {loan.calculation_type.toUpperCase()}
624|                  </CardDescription>
625|                </div>
626|                <Badge variant={loan.status === "paid" ? "success" : loan.status === "active" ? "default" : "destructive"}>
627|                  {loan.status === "paid" ? "Pago" : loan.status === "active" ? "Ativo" : "Atrasado"}
628|                </Badge>
629|              </div>
630|            </CardHeader>
631|            <CardContent>
632|              <div className="flex items-center justify-between text-sm">
633|                <span>Taxa: {loan.interest_rate}% a.m.</span>
634|                <span>Data: {formatDate(loan.loan_date)}</span>
635|              </div>
636|            </CardContent>
637|          </Card>
638|        ))}
639|      </div>
640|    </div>
641|  );
642|};
643|
644|const LoanDetail = () => {
645|  const [loan, setLoan] = useState(null);
646|  const [installments, setInstallments] = useState([]);
647|  const [clients, setClients] = useState([]);
648|  const [selectedInstallment, setSelectedInstallment] = useState(null);
649|  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
650|  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
651|  const [paymentAmount, setPaymentAmount] = useState("");
652|  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
653|  const [editFormData, setEditFormData] = useState({
654|    client_id: "",
655|    amount: "",
656|    interest_rate: "",
657|    num_installments: "",
658|    calculation_type: "price",
659|    loan_date: ""
660|  });
661|
662|  useEffect(() => {
663|    loadLoanData();
664|  }, []);
665|
666|  const loadLoanData = async () => {
667|    try {
668|      const loanId = window.location.pathname.split('/').pop();
669|      const [loanRes, installmentsRes, clientsRes] = await Promise.all([
670|        axios.get(`${API}/loans/${loanId}`),
671|        axios.get(`${API}/loans/${loanId}/installments`),
672|        axios.get(`${API}/clients`)
673|      ]);
674|      setLoan(loanRes.data);
675|      setInstallments(installmentsRes.data);
676|      setClients(clientsRes.data);
677|    } catch (error) {
678|      toast.error("Erro ao carregar dados do empréstimo");
679|    }
680|  };
681|
682|  const handlePayment = async (e) => {
683|    e.preventDefault();
684|    try {
685|      await axios.post(`${API}/payments`, {
686|        installment_id: selectedInstallment.id,
687|        amount: parseFloat(paymentAmount),
688|        payment_date: new Date(paymentDate).toISOString(),
689|        notes: ""
690|      });
691|      toast.success("Pagamento registrado com sucesso!");
692|      setIsPaymentDialogOpen(false);
693|      setPaymentAmount("");
694|      loadLoanData();
695|    } catch (error) {
696|      toast.error("Erro ao registrar pagamento");
697|    }
698|  };
699|
700|  const openPaymentDialog = (installment) => {
701|    setSelectedInstallment(installment);
702|    const remaining = installment.amount + installment.late_fee - installment.paid_amount;
703|    setPaymentAmount(remaining.toFixed(2));
704|    setIsPaymentDialogOpen(true);
705|  };
706|
707|  const openEditDialog = () => {
708|    setEditFormData({
709|      client_id: loan.client_id,
710|      amount: loan.amount.toString(),
711|      interest_rate: loan.interest_rate.toString(),
712|      num_installments: loan.num_installments.toString(),
713|      calculation_type: loan.calculation_type,
714|      loan_date: new Date(loan.loan_date).toISOString().split('T')[0]
715|    });
716|    setIsEditDialogOpen(true);
717|  };
718|
719|  const handleEditLoan = async (e) => {
720|    e.preventDefault();
721|    try {
722|      const loanId = window.location.pathname.split('/').pop();
723|      const payload = {
724|        ...editFormData,
725|        amount: parseFloat(editFormData.amount),
726|        interest_rate: parseFloat(editFormData.interest_rate),
727|        num_installments: parseInt(editFormData.num_installments),
728|        loan_date: new Date(editFormData.loan_date).toISOString()
729|      };
730|      await axios.put(`${API}/loans/${loanId}`, payload);
731|      toast.success("Empréstimo atualizado com sucesso!");
732|      setIsEditDialogOpen(false);
733|      loadLoanData();
734|    } catch (error) {
735|      if (error.response?.data?.detail) {
736|        toast.error(error.response.data.detail);
737|      } else {
738|        toast.error("Erro ao atualizar empréstimo");
739|      }
740|    }
741|  };
742|
743|  const handleDeleteLoan = async () => {
744|    if (!window.confirm("Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita.")) {
745|      return;
746|    }
747|    try {
748|      const loanId = window.location.pathname.split('/').pop();
749|      await axios.delete(`${API}/loans/${loanId}`);
750|      toast.success("Empréstimo excluído com sucesso!");
751|      window.location.href = '/loans';
752|    } catch (error) {
753|      if (error.response?.data?.detail) {
754|        toast.error(error.response.data.detail);
755|      } else {
756|        toast.error("Erro ao excluir empréstimo");
757|      }
758|    }
759|  };
760|
761|  const formatCurrency = (value) => {
762|    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
763|  };
764|
765|  const formatDate = (dateStr) => {
766|    return new Date(dateStr).toLocaleDateString('pt-BR');
767|  };
768|
769|  const getStatusBadge = (status) => {
770|    const variants = {
771|      paid: "success",
772|      pending: "default",
773|      overdue: "destructive",
774|      partial: "warning"
775|    };
776|    const labels = {
777|      paid: "Pago",
778|      pending: "Pendente",
779|      overdue: "Atrasado",
780|      partial: "Parcial"
781|    };
782|    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
783|  };
784|
785|  if (!loan) return <div>Carregando...</div>;
786|
787|  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
788|  const totalPaid = installments.reduce((sum, inst) => sum + inst.paid_amount, 0);
789|  const totalRemaining = installments.reduce((sum, inst) => {
790|    if (inst.status !== "paid") {
791|      return sum + (inst.amount + inst.late_fee - inst.paid_amount);
792|    }
793|    return sum;
794|  }, 0);
795|
796|  const hasPayments = installments.some(inst => inst.paid_amount > 0);
797|
798|  return (
799|    <div className="space-y-6" data-testid="loan-detail-page">
800|      <div>

Action: file_editor view /app/frontend/src/App.js
Observation: /app/frontend/src/App.js:
800|      <div>
801|        <Button variant="ghost" onClick={() => window.history.back()} data-testid="back-button">
802|          ← Voltar
803|        </Button>
804|        <div className="flex items-center justify-between mt-4">
805|          <h2 className="text-3xl font-bold tracking-tight">Detalhes do Empréstimo</h2>
806|          <div className="flex gap-2">
807|            <Button 
808|              variant="outline" 
809|              onClick={openEditDialog}
810|              data-testid="edit-loan-button"
811|              disabled={hasPayments}
812|            >
813|              Editar
814|            </Button>
815|            <Button 
816|              variant="destructive" 
817|              onClick={handleDeleteLoan}
818|              data-testid="delete-loan-button"
819|              disabled={hasPayments}
820|            >
821|              Excluir
822|            </Button>
823|          </div>
824|        </div>
825|        {hasPayments && (
826|          <p className="text-sm text-muted-foreground mt-2">
827|            * Empréstimos com pagamentos realizados não podem ser editados ou excluídos
828|          </p>
829|        )}
830|      </div>
831|
832|      <div className="grid gap-4 md:grid-cols-3">
833|        <Card>
834|          <CardHeader>
835|            <CardTitle className="text-sm">Total do Empréstimo</CardTitle>
836|          </CardHeader>
837|          <CardContent>
838|            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
839|          </CardContent>
840|        </Card>
841|        <Card>
842|          <CardHeader>
843|            <CardTitle className="text-sm">Total Pago</CardTitle>
844|          </CardHeader>
845|          <CardContent>
846|            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
847|          </CardContent>
848|        </Card>
849|        <Card>
850|          <CardHeader>
851|            <CardTitle className="text-sm">Restante</CardTitle>
852|          </CardHeader>
853|          <CardContent>
854|            <div className="text-2xl font-bold">{formatCurrency(totalRemaining)}</div>
855|          </CardContent>
856|        </Card>
857|      </div>
858|
859|      <Card>
860|        <CardHeader>
861|          <CardTitle>Informações</CardTitle>
862|        </CardHeader>
863|        <CardContent className="space-y-2">
864|          <p><strong>Cliente:</strong> {loan.client_name}</p>
865|          <p><strong>Valor Emprestado:</strong> {formatCurrency(loan.amount)}</p>
866|          <p><strong>Taxa de Juros:</strong> {loan.interest_rate}% ao mês</p>
867|          <p><strong>Tipo de Cálculo:</strong> {loan.calculation_type.toUpperCase()}</p>
868|          <p><strong>Número de Parcelas:</strong> {loan.num_installments}x</p>
869|          <p><strong>Data do Empréstimo:</strong> {formatDate(loan.loan_date)}</p>
870|          <div><strong>Status:</strong> {getStatusBadge(loan.status)}</div>
871|        </CardContent>
872|      </Card>
873|
874|      <Card>
875|        <CardHeader>
876|          <CardTitle>Parcelas</CardTitle>
877|        </CardHeader>
878|        <CardContent>
879|          <div className="space-y-3">
880|            {installments.map((inst) => {
881|              const remaining = inst.amount + inst.late_fee - inst.paid_amount;
882|              return (
883|                <div key={inst.id} className="border rounded-lg p-4" data-testid={`installment-${inst.id}`}>
884|                  <div className="flex items-center justify-between mb-2">
885|                    <div>
886|                      <p className="font-medium">Parcela {inst.installment_number}</p>
887|                      <p className="text-sm text-muted-foreground">Vencimento: {formatDate(inst.due_date)}</p>
888|                    </div>
889|                    {getStatusBadge(inst.status)}
890|                  </div>
891|                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
892|                    <div>
893|                      <p className="text-muted-foreground">Valor</p>
894|                      <p className="font-medium">{formatCurrency(inst.amount)}</p>
895|                    </div>
896|                    <div>
897|                      <p className="text-muted-foreground">Juros</p>
898|                      <p className="font-medium">{formatCurrency(inst.interest)}</p>
899|                    </div>
900|                    {inst.late_fee > 0 && (
901|                      <div>
902|                        <p className="text-muted-foreground">Multa</p>
903|                        <p className="font-medium text-red-600">{formatCurrency(inst.late_fee)}</p>
904|                      </div>
905|                    )}
906|                    {inst.paid_amount > 0 && (
907|                      <div>
908|                        <p className="text-muted-foreground">Pago</p>
909|                        <p className="font-medium text-green-600">{formatCurrency(inst.paid_amount)}</p>
910|                      </div>
911|                    )}
912|                  </div>
913|                  {inst.status !== "paid" && (
914|                    <Button
915|                      size="sm"
916|                      onClick={() => openPaymentDialog(inst)}
917|                      data-testid={`pay-installment-${inst.id}`}
918|                    >
919|                      Registrar Pagamento ({formatCurrency(remaining)})
920|                    </Button>
921|                  )}
922|                </div>
923|              );
924|            })}
925|          </div>
926|        </CardContent>
927|      </Card>
928|
929|      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
930|        <DialogContent data-testid="payment-dialog">
931|          <DialogHeader>
932|            <DialogTitle>Registrar Pagamento</DialogTitle>
933|            <DialogDescription>
934|              Parcela {selectedInstallment?.installment_number}
935|            </DialogDescription>
936|          </DialogHeader>
937|          <form onSubmit={handlePayment} className="space-y-4">
938|            <div>
939|              <Label htmlFor="payment_amount">Valor do Pagamento *</Label>
940|              <Input
941|                id="payment_amount"
942|                type="number"
943|                step="0.01"
944|                data-testid="payment-amount-input"
945|                value={paymentAmount}
946|                onChange={(e) => setPaymentAmount(e.target.value)}
947|                required
948|              />
949|            </div>
950|            <div>
951|              <Label htmlFor="payment_date">Data do Pagamento *</Label>
952|              <Input
953|                id="payment_date"
954|                type="date"
955|                data-testid="payment-date-input"
956|                value={paymentDate}
957|                onChange={(e) => setPaymentDate(e.target.value)}
958|                required
959|              />
960|            </div>
961|            <Button type="submit" className="w-full" data-testid="submit-payment-button">
962|              Confirmar Pagamento
963|            </Button>
964|          </form>
965|        </DialogContent>
966|      </Dialog>
967|
968|      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
969|        <DialogContent data-testid="edit-loan-dialog">
970|          <DialogHeader>
971|            <DialogTitle>Editar Empréstimo</DialogTitle>
972|            <DialogDescription>
973|              Atualize as informações do empréstimo (parcelas serão recalculadas)
974|            </DialogDescription>
975|          </DialogHeader>
976|          <form onSubmit={handleEditLoan} className="space-y-4">
977|            <div>
978|              <Label htmlFor="edit_client_id">Cliente *</Label>
979|              <Select
980|                value={editFormData.client_id}
981|                onValueChange={(value) => setEditFormData({ ...editFormData, client_id: value })}
982|                required
983|              >
984|                <SelectTrigger data-testid="edit-loan-client-select">
985|                  <SelectValue placeholder="Selecione um cliente" />
986|                </SelectTrigger>
987|                <SelectContent>
988|                  {clients.map((client) => (
989|                    <SelectItem key={client.id} value={client.id}>
990|                      {client.name}
991|                    </SelectItem>
992|                  ))}
993|                </SelectContent>
994|              </Select>
995|            </div>
996|            <div>
997|              <Label htmlFor="edit_amount">Valor Emprestado *</Label>
998|              <Input
999|                id="edit_amount"
1000|                type="number"
1001|                step="0.01"
1002|                data-testid="edit-loan-amount-input"
1003|                value={editFormData.amount}
1004|                onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
1005|                required
1006|              />
1007|            </div>
1008|            <div>
1009|              <Label htmlFor="edit_interest_rate">Taxa de Juros (% ao mês) *</Label>
1010|              <Input
1011|                id="edit_interest_rate"
1012|                type="number"
1013|                step="0.01"
1014|                data-testid="edit-loan-interest-input"
1015|                value={editFormData.interest_rate}
1016|                onChange={(e) => setEditFormData({ ...editFormData, interest_rate: e.target.value })}
1017|                required
1018|              />
1019|            </div>
1020|            <div>
1021|              <Label htmlFor="edit_num_installments">Número de Parcelas *</Label>
1022|              <Input
1023|                id="edit_num_installments"
1024|                type="number"
1025|                data-testid="edit-loan-installments-input"
1026|                value={editFormData.num_installments}
1027|                onChange={(e) => setEditFormData({ ...editFormData, num_installments: e.target.value })}
1028|                required
1029|              />
1030|            </div>
1031|            <div>
1032|              <Label htmlFor="edit_calculation_type">Tipo de Cálculo *</Label>
1033|              <Select
1034|                value={editFormData.calculation_type}
1035|                onValueChange={(value) => setEditFormData({ ...editFormData, calculation_type: value })}
1036|              >
1037|                <SelectTrigger data-testid="edit-loan-calc-type-select">
1038|                  <SelectValue />
1039|                </SelectTrigger>
1040|                <SelectContent>
1041|                  <SelectItem value="simple">Juros Simples</SelectItem>
1042|                  <SelectItem value="compound">Juros Compostos</SelectItem>
1043|                  <SelectItem value="price">Tabela Price</SelectItem>
1044|                  <SelectItem value="sac">SAC</SelectItem>
1045|                </SelectContent>
1046|              </Select>
1047|            </div>
1048|            <div>
1049|              <Label htmlFor="edit_loan_date">Data do Empréstimo *</Label>
1050|              <Input

Action: file_editor view /app/frontend/src/App.js
Observation: /app/frontend/src/App.js:
1050|              <Input
1051|                id="edit_loan_date"
1052|                type="date"
1053|                data-testid="edit-loan-date-input"
1054|                value={editFormData.loan_date}
1055|                onChange={(e) => setEditFormData({ ...editFormData, loan_date: e.target.value })}
1056|                required
1057|              />
1058|            </div>
1059|            <Button type="submit" className="w-full" data-testid="submit-edit-loan-button">
1060|              Atualizar Empréstimo
1061|            </Button>
1062|          </form>
1063|        </DialogContent>
1064|      </Dialog>
1065|    </div>
1066|  );
1067|};
1068|
1069|// ==================== MAIN APP ====================
1070|
1071|const Layout = ({ children }) => {
1072|  const navigate = useNavigate();
1073|  
1074|  return (
1075|    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
1076|      <nav className="bg-white border-b shadow-sm">
1077|        <div className="container mx-auto px-4">
1078|          <div className="flex items-center justify-between h-16">
1079|            <h1 className="text-2xl font-bold text-primary">GestãoCredi</h1>
1080|            <div className="flex space-x-1">
1081|              <Button
1082|                variant="ghost"
1083|                onClick={() => navigate('/')}
1084|                data-testid="nav-dashboard"
1085|              >
1086|                Dashboard
1087|              </Button>
1088|              <Button
1089|                variant="ghost"
1090|                onClick={() => navigate('/clients')}
1091|                data-testid="nav-clients"
1092|              >
1093|                Clientes
1094|              </Button>
1095|              <Button
1096|                variant="ghost"
1097|                onClick={() => navigate('/loans')}
1098|                data-testid="nav-loans"
1099|              >
1100|                Empréstimos
1101|              </Button>
1102|            </div>
1103|          </div>
1104|        </div>
1105|      </nav>
1106|      <main className="container mx-auto px-4 py-8">
1107|        {children}
1108|      </main>
1109|    </div>
1110|  );
1111|};
1112|
1113|function App() {
1114|  return (
1115|    <div className="App">
1116|      <Toaster richColors position="top-right" />
1117|      <BrowserRouter>
1118|        <Routes>
1119|          <Route path="/" element={<Layout><Dashboard /></Layout>} />
1120|          <Route path="/clients" element={<Layout><Clients /></Layout>} />
1121|          <Route path="/clients/:id" element={<Layout><ClientDetail /></Layout>} />
1122|          <Route path="/loans" element={<Layout><Loans /></Layout>} />
1123|          <Route path="/loans/:id" element={<Layout><LoanDetail /></Layout>} />
1124|        </Routes>
1125|      </BrowserRouter>
1126|    </div>
1127|  );
1128|}
1129|
1130|export default App;
1131|
