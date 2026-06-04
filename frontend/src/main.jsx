import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  CreditCard,
  LogIn,
  LogOut,
  Plus,
  ReceiptText,
  ShoppingCart,
  Utensils,
  UserRound,
} from "lucide-react";
import "./styles.css";
import { api, formatMwk } from "./services/api";



const malawiImages = {
  nsima: "",
  nsimaChicken: "",
  nsimaPlate: "",
  chambo: "",
  friedChambo: "",
  chiwaya: "",
  localDish: "",
  assorted: "",
  okraTomato: "",
  greens: "",
  chicken: "",
  mandasi: "",
  fishChips: "",
  pizza: "",
  burger: "",
};

const fallbackMenu = [
  ["Nsima with Fish", "Local Meals", 6500, malawiImages.fishChips],
  ["Rice with Chicken", "Rice Dishes", 6000, malawiImages.nsimaChicken],
  ["Rice with Beef", "Rice Dishes", 7000, malawiImages.assorted],
  ["Chips with Chicken", "Fast Foods", 7500, malawiImages.chiwaya],
  ["Plain Chips", "Fast Foods", 3000, malawiImages.chiwaya],
  ["Pizza", "Fast Foods", 9500, malawiImages.pizza],
  ["Burger", "Fast Foods", 6500, malawiImages.burger],
  ["Nsima with Eggs", "Local Meals", 4000, malawiImages.nsimaPlate],
  ["Nsima with Chicken", "Local Meals", 6500, malawiImages.nsimaChicken],
  ["Nsima with Beef", "Local Meals", 7000, malawiImages.assorted],
  ["Nsima with Beans", "Local Meals", 3500, malawiImages.assorted],
  ["Rice with Beans", "Rice Dishes", 4000, malawiImages.assorted],
  ["Rice with Fish", "Rice Dishes", 6500, malawiImages.chambo],
  ["Chicken Curry", "Rice Dishes", 8000, malawiImages.chicken],
  ["Beef Curry", "Rice Dishes", 8500, malawiImages.assorted],
  ["Vegetable Stir Fry", "Vegetarian", 5000, malawiImages.okraTomato],
  ["Chicken Wrap", "Fast Foods", 5500, malawiImages.chicken],
  ["Beef Sausage and Chips", "Fast Foods", 4500, malawiImages.chiwaya],
  ["Grilled Fish and Chips", "Fast Foods", 8500, malawiImages.fishChips],
  ["Chicken Salad", "Light Meals", 5500, malawiImages.greens],
].map(([name, category, price_mwk, image_url], index) => ({
  id: `demo-${index + 1}`,
  name,
  category,
  price_mwk,
  image_url,
  description: `${name} from NRC Restaurant. Freshly prepared for you.`,
  available: true,
}));

const pages = [
  { id: "menu", label: "Menu", icon: Utensils },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

function App() {
  const [welcomed, setWelcomed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("customer");
  const [activePage, setActivePage] = useState("menu");
  const [menuItems, setMenuItems] = useState(fallbackMenu);
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [report, setReport] = useState(null);
  const [notice, setNotice] = useState("");
  const [apiConnected, setApiConnected] = useState(false);

  async function refreshData() {
    try {
      await api.health();
      const [menu, orderData, billData, reportData] = await Promise.all([
        api.getMenuItems(),
        api.getOrders(),
        api.getBills(),
        api.getSalesReport(),
      ]);
      setMenuItems(menu);
      setOrders(orderData);
      setBills(billData);
      setReport(reportData);
      setApiConnected(true);
      setNotice("Connected to Django backend.");
    } catch {
      setApiConnected(false);
      setNotice("");
    }
  }

  useEffect(() => {
    if (loggedIn) refreshData();
  }, [loggedIn]);

  if (!welcomed) {
    return <WelcomePage onContinue={() => setWelcomed(true)} />;
  }

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={(role) => {
          setUserRole(role);
          setActivePage(role === "customer" ? "orders" : "menu");
          setLoggedIn(true);
        }}
      />
    );
  }

  const ActiveIcon = pages.find((page) => page.id === activePage)?.icon || ClipboardList;
  const visiblePages =
    userRole === "admin" ? pages : pages.filter((page) => ["menu", "orders", "billing"].includes(page.id));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <ChefHat size={28} />
          <div>
            <strong>NRC</strong>
            <span>Ordering System</span>
          </div>
          <span className="role-badge">{userRole === "admin" ? "Admin" : "Customer"}</span>
        </div>
        <nav>
          {visiblePages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                className={activePage === page.id ? "nav-item active" : "nav-item"}
                key={page.id}
                onClick={() => setActivePage(page.id)}
                title={page.label}
              >
                <Icon size={18} />
                <span>{page.label}</span>
              </button>
            );
          })}
        </nav>
        <button className="logout" onClick={() => setLoggedIn(false)}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Restaurant Control Panel</p>
            <h1>
              <ActiveIcon size={30} />
              {pages.find((page) => page.id === activePage)?.label}
            </h1>
          </div>
          <button className="secondary" onClick={refreshData}>
            Refresh
          </button>
        </header>
        {apiConnected && (
          <div className="notice connected">
            <span>API Connected</span>
            <p>{notice}</p>
          </div>
        )}

        {activePage === "menu" && <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} />}
        {activePage === "orders" && (
          <OrderPlacement menuItems={menuItems} orders={orders} setOrders={setOrders} onSaved={refreshData} />
        )}
        {activePage === "kitchen" && <KitchenDashboard orders={orders} onSaved={refreshData} />}
        {activePage === "billing" && <BillingSystem bills={bills} onSaved={refreshData} />}
        {activePage === "reports" && <SalesReport report={report} bills={bills} orders={orders} />}
      </main>
    </div>
  );
}

function WelcomePage({ onContinue }) {
  const title = "WELCOME TO NRC RESTAURANT";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(title.slice(0, i));
      if (i >= title.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="welcome-page">
      <section className="welcome-content">
        <div className="welcome-mark">
          <ChefHat size={54} />
        </div>
        <p className="eyebrow">Fresh meals in Malawi Kwacha</p>
        <h1 className="welcome-typed">{typed}</h1>
        <p>Order local meals, fast foods, drinks, and daily specials from one simple restaurant system.</p>
        <button className="primary welcome-button" onClick={onContinue}>
          Enter Restaurant
        </button>
      </section>
    </main>
  );
}

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("customer");
  const [customerBuyName, setCustomerBuyName] = useState("");

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-mark">
          {role === "admin" ? <Utensils size={42} /> : <UserRound size={42} />}
        </div>
        <h1>NRC Restaurant Login</h1>
        <p>
          {role === "admin"
            ? "Admin access for menu, kitchen, billing, and reports."
            : "Customer access to view meals and place an order."}
        </p>

        <div className="role-switch">
          <button className={role === "customer" ? "active" : ""} type="button" onClick={() => setRole("customer")}>
            Buy (Customer)
          </button>
          <button className={role === "admin" ? "active" : ""} type="button" onClick={() => setRole("admin")}>
            Admin
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onLogin(role);
          }}
        >
          {role === "customer" ? (
            <>
              <label>
                Customer name
                <input defaultValue={"Guest Customer"} onChange={(e) => setCustomerBuyName(e.target.value)} />
              </label>
              <label>
                Phone number
                <input placeholder="Optional" />
              </label>
            </>
          ) : (
            <>
              <label>
                Username
                <input defaultValue="admin" />
              </label>
              <label>
                Password
                <input type="password" defaultValue="admin123" />
              </label>
            </>
          )}
          <button className="primary" type="submit">
            <LogIn size={18} />
            {role === "admin" ? "Login as Admin" : "Enter to Order"}
          </button>
        </form>

        {role === "customer" && customerBuyName && (
          <p style={{ marginTop: 12, fontWeight: 900, color: "#684d22" }}>
            Welcome, {customerBuyName}.
          </p>
        )}
      </section>
    </main>
  );
}

function MenuManagement({ menuItems, setMenuItems }) {
  const [form, setForm] = useState({ name: "", category: "Local Meals", price_mwk: "", image_url: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...new Set(menuItems.map((meal) => meal.category))];
  const visibleMeals =
    selectedCategory === "All" ? menuItems : menuItems.filter((meal) => meal.category === selectedCategory);

  async function addMeal(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price_mwk: Number(form.price_mwk),
      description: "Added from menu management.",
      image_url: form.image_url,
      available: true,
    };
    try {
      const saved = await api.createMenuItem(payload);
      setMenuItems((items) => [...items, saved]);
    } catch {
      setMenuItems((items) => [...items, { ...payload, id: `local-${Date.now()}` }]);
    }
    setForm({ name: "", category: "Local Meals", price_mwk: "", image_url: "" });
  }

  return (
    <section className="grid two">
      <div className="panel">
        <h2>Menu Meals</h2>
        <div className="category-strip">
          {categories.map((category) => (
            <button
              className={selectedCategory === category ? "category-pill active" : "category-pill"}
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="menu-picture-grid">
          {visibleMeals.map((meal) => (
            <article className="food-card" key={meal.id}>
              <div>
                <span>{meal.category}</span>
                <strong>{meal.name}</strong>
                <b>{formatMwk(meal.price_mwk)}</b>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2>Add Meal</h2>
        <form className="stack" onSubmit={addMeal}>
          <label>
            Meal name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option>Local Meals</option>
              <option>Rice Dishes</option>
              <option>Fast Foods</option>
              <option>Vegetarian</option>
              <option>Breakfast</option>
            </select>
          </label>
          <label>
            Price in Malawi Kwacha
            <input
              type="number"
              min="1"
              value={form.price_mwk}
              onChange={(event) => setForm({ ...form, price_mwk: event.target.value })}
              required
            />
          </label>
          <button type="submit" className="primary">
            <Plus size={18} />
            Add Meal
          </button>
        </form>
      </div>
    </section>
  );
}

function OrderPlacement({ menuItems, orders, setOrders, onSaved }) {
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price_mwk) * item.quantity, 0),
    [cart]
  );

  function addToCart(meal) {
    setCart((items) => {
      const existing = items.find((item) => item.id === meal.id);
      if (existing) {
        return items.map((item) => (item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...items, { ...meal, quantity: 1 }];
    });
  }

  async function placeOrder(event) {
    event.preventDefault();
    const payload = {
      customer_name: customerName,
      table_number: tableNumber,
      items: cart.map((item) => ({ menu_item: item.id, quantity: item.quantity })),
    };
    try {
      await api.createOrder(payload);
      await onSaved();
    } catch {
      const localOrder = {
        id: `local-${Date.now()}`,
        customer_name: customerName,
        table_number: tableNumber,
        status: "PLACED",
        total_mwk: total,
        items: cart.map((item) => ({ menu_item_name: item.name, quantity: item.quantity })),
      };
      setOrders([localOrder, ...orders]);
    }
    setCustomerName("");
    setTableNumber("");
    setCart([]);
  }

  return (
    <section className="grid two wide-left">
      <div className="panel">
        <h2>Select Meals</h2>
        <CategorySummary menuItems={menuItems} />
        <div className="meal-grid">
          {menuItems.map((meal) => (
            <button className="meal-tile" key={meal.id} onClick={() => addToCart(meal)}>
              <span>{meal.category}</span>
              <strong>{meal.name}</strong>
              <b>{formatMwk(meal.price_mwk)}</b>
            </button>
          ))}
        </div>
      </div>
      <form className="panel stack" onSubmit={placeOrder}>
        <h2>Current Order</h2>
        <label>
          Customer name
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
        </label>
        <label>
          Table number
          <input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} />
        </label>
        <div className="cart-list">
          {cart.length === 0 && <p className="muted">Choose meals from the menu.</p>}
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <span>{item.name}</span>
              <strong>x{item.quantity}</strong>
            </div>
          ))}
        </div>
        <div className="total">
          <span>Total</span>
          <strong>{formatMwk(total)}</strong>
        </div>
        <button type="submit" className="primary" disabled={cart.length === 0}>
          <ReceiptText size={18} />
          Place Order
        </button>
      </form>
    </section>
  );
}

function CategorySummary({ menuItems }) {
  const categories = [...new Set(menuItems.map((meal) => meal.category))];

  return (
    <div className="category-showcase">
      {categories.map((category) => {
        return (
          <div className="category-card" key={category}>
            <strong>{category}</strong>
            <span>{menuItems.filter((meal) => meal.category === category).length} meals</span>
          </div>
        );
      })}
    </div>
  );
}

function fallbackImage(category) {
  return "";
}

function KitchenDashboard({ orders, onSaved }) {
  async function updateStatus(order, status) {
    if (String(order.id).startsWith("local-")) return;
    await api.updateOrderStatus(order.id, status);
    await onSaved();
  }

  return (
    <section className="panel">
      <h2>Kitchen Orders</h2>
      <div className="order-board">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div>
              <strong>Order #{order.id}</strong>
              <span>{order.customer_name} {order.table_number && `- Table ${order.table_number}`}</span>
            </div>
            <p className={`status ${order.status.toLowerCase()}`}>{order.status}</p>
            <ul>
              {order.items?.map((item) => (
                <li key={`${order.id}-${item.id || item.menu_item_name}`}>
                  {item.quantity} x {item.menu_item_name}
                </li>
              ))}
            </ul>
            <div className="actions">
              <button onClick={() => updateStatus(order, "PREPARING")}>Preparing</button>
              <button onClick={() => updateStatus(order, "READY")}>Ready</button>
              <button onClick={() => updateStatus(order, "SERVED")}>Served</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BillingSystem({ bills, onSaved }) {
  async function markPaid(bill, method) {
    await api.updateBill(bill.id, { payment_status: "PAID", payment_method: method });
    await onSaved();
  }

  return (
    <section className="panel">
      <h2>Billing System</h2>
      <div className="table bill-table">
        <div className="table-row table-head">
          <span>Order</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {bills.map((bill) => (
          <div className="table-row" key={bill.id}>
            <strong>#{bill.order_number}</strong>
            <span>{bill.customer_name}</span>
            <span>{formatMwk(bill.amount_mwk)}</span>
            <span>{bill.payment_status}</span>
            <span className="split-actions">
              <button onClick={() => markPaid(bill, "CASH")}>Cash</button>
              <button onClick={() => markPaid(bill, "MOBILE_MONEY")}>Mobile</button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SalesReport({ report, bills, orders }) {
  const localSales = bills.reduce((sum, bill) => {
    return bill.payment_status === "PAID" ? sum + Number(bill.amount_mwk) : sum;
  }, 0);

  return (
    <section className="grid three">
      <div className="metric">
        <span>Total Sales</span>
        <strong>{formatMwk(report?.total_sales_mwk ?? localSales)}</strong>
      </div>
      <div className="metric">
        <span>Paid Orders</span>
        <strong>{report?.paid_orders ?? bills.filter((bill) => bill.payment_status === "PAID").length}</strong>
      </div>
      <div className="metric">
        <span>Open Bills</span>
        <strong>{report?.open_bills ?? bills.filter((bill) => bill.payment_status === "UNPAID").length}</strong>
      </div>
      <div className="panel full">
        <h2>Popular Meals</h2>
        <div className="table">
          <div className="table-row table-head">
            <span>Meal</span>
            <span>Quantity Sold</span>
            <span>Orders</span>
          </div>
          {(report?.popular_items || []).map((item) => (
            <div className="table-row" key={item.menu_item__name}>
              <strong>{item.menu_item__name}</strong>
              <span>{item.quantity_sold}</span>
              <span>{item.order_count}</span>
            </div>
          ))}
          {!report?.popular_items?.length && <p className="muted">Paid order sales will appear here.</p>}
        </div>
      </div>
      <div className="panel full">
        <h2>Recent Orders</h2>
        <div className="order-board compact">
          {orders.slice(0, 6).map((order) => (
            <article className="order-card" key={order.id}>
              <strong>Order #{order.id}</strong>
              <span>{order.customer_name}</span>
              <b>{formatMwk(order.total_mwk)}</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
