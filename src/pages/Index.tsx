import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "dashboard" | "compose" | "schedule" | "subscribers";

interface Group {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface Scheduled {
  id: string;
  text: string;
  group: string;
  datetime: string;
  status: "pending" | "sent";
}

const GROUPS: Group[] = [
  { id: "all", name: "Все подписчики", count: 1248, color: "#6366f1" },
  { id: "vip", name: "VIP клиенты", count: 84, color: "#f59e0b" },
  { id: "new", name: "Новые", count: 312, color: "#10b981" },
  { id: "inactive", name: "Неактивные", count: 203, color: "#6b7280" },
];

const INITIAL_SCHEDULED: Scheduled[] = [
  { id: "1", text: "Напоминаем: акция действует до конца недели!", group: "Все подписчики", datetime: "2026-02-22 10:00", status: "pending" },
  { id: "2", text: "Только для вас — скидка 20% на следующий заказ.", group: "VIP клиенты", datetime: "2026-02-23 14:00", status: "pending" },
  { id: "3", text: "Добро пожаловать! Рады видеть вас среди нас.", group: "Новые", datetime: "2026-02-21 09:00", status: "sent" },
];

const STATS = [
  { label: "Подписчиков", value: "1 248", icon: "Users", delta: "+24 за неделю" },
  { label: "Отправлено", value: "3 841", icon: "Send", delta: "за всё время" },
  { label: "Открываемость", value: "68%", icon: "BarChart2", delta: "+3% к прошлой неделе" },
  { label: "Запланировано", value: "2", icon: "Clock", delta: "ближайших рассылки" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [text, setText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [datetime, setDatetime] = useState("");
  const [scheduled, setScheduled] = useState<Scheduled[]>(INITIAL_SCHEDULED);
  const [sent, setSent] = useState(false);

  const handleSchedule = () => {
    if (!text.trim() || !datetime) return;
    const group = GROUPS.find((g) => g.id === selectedGroup);
    const newItem: Scheduled = {
      id: Date.now().toString(),
      text,
      group: group?.name ?? "Все подписчики",
      datetime,
      status: "pending",
    };
    setScheduled((prev) => [newItem, ...prev]);
    setText("");
    setDatetime("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleDelete = (id: string) => {
    setScheduled((prev) => prev.filter((s) => s.id !== id));
  };

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Обзор", icon: "LayoutDashboard" },
    { id: "compose", label: "Создать", icon: "PenLine" },
    { id: "schedule", label: "Расписание", icon: "CalendarClock" },
    { id: "subscribers", label: "Группы", icon: "Users" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f7] font-golos flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col py-8 px-4 gap-1">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Icon name="Send" size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">NewsBot</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 pl-9">Панель управления</p>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === item.id
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">Telegram Bot</p>
            <p className="text-xs text-amber-500 mt-0.5">Токен не задан</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-8 py-8 max-w-4xl">
        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Обзор</h1>
            <p className="text-sm text-gray-400 mb-8">Состояние вашей рассылки</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Icon name={s.icon} size={15} className="text-indigo-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.delta}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Ближайшие рассылки</h2>
              <div className="space-y-3">
                {scheduled.filter((s) => s.status === "pending").slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Icon name="Clock" size={14} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{s.text}</p>
                      <p className="text-xs text-gray-400">{s.group} · {s.datetime}</p>
                    </div>
                  </div>
                ))}
                {scheduled.filter((s) => s.status === "pending").length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Нет запланированных рассылок</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compose */}
        {tab === "compose" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Создать рассылку</h1>
            <p className="text-sm text-gray-400 mb-8">Напишите сообщение и выберите аудиторию</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Группа получателей</label>
                <div className="grid grid-cols-2 gap-2">
                  {GROUPS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGroup(g.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        selectedGroup === g.id
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="flex-1 text-left">{g.name}</span>
                      <span className="text-xs text-gray-400">{g.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Текст сообщения</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Введите текст рассылки..."
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
                />
                <p className="text-xs text-gray-300 mt-1 text-right">{text.length} символов</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Дата и время отправки</label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSchedule}
                  disabled={!text.trim() || !datetime}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
                >
                  <Icon name="CalendarCheck" size={15} />
                  Запланировать
                </button>
                <button
                  onClick={() => { setText(""); setDatetime(""); }}
                  className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2.5 transition-colors"
                >
                  Очистить
                </button>
              </div>

              {sent && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl animate-fade-in">
                  <Icon name="CheckCircle" size={15} />
                  Рассылка запланирована
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule */}
        {tab === "schedule" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Расписание</h1>
            <p className="text-sm text-gray-400 mb-8">Все запланированные и отправленные сообщения</p>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {scheduled.length === 0 && (
                <div className="py-16 text-center text-gray-400 text-sm">Нет сообщений</div>
              )}
              {scheduled.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 px-6 py-4 ${i !== scheduled.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === "sent" ? "bg-emerald-400" : "bg-indigo-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{s.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.group} · {s.datetime}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg shrink-0 ${
                    s.status === "sent"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {s.status === "sent" ? "Отправлено" : "Ожидает"}
                  </span>
                  {s.status === "pending" && (
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors ml-1"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribers */}
        {tab === "subscribers" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Группы подписчиков</h1>
            <p className="text-sm text-gray-400 mb-8">Сегменты для целевых рассылок</p>

            <div className="space-y-3">
              {GROUPS.map((g) => (
                <div key={g.id} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: g.color + "18" }}
                  >
                    <Icon name="Users" size={18} style={{ color: g.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{g.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{g.count} подписчиков</p>
                  </div>
                  <div className="w-32 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(g.count / 1248) * 100}%`, backgroundColor: g.color }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-500 w-10 text-right">
                    {Math.round((g.count / 1248) * 100)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 flex items-center gap-3">
              <Icon name="Info" size={15} className="text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-600">Группы формируются автоматически при подключении Telegram-бота</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
