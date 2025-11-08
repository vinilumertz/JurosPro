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
