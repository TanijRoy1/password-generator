## Assignment 7: Customer Support Zone

### 1. Change status and arrange updatedTickets by id:

```js
const handleInProgress = (ticket) => {
  if (ticket.status === "Open") {
    const newTicket = { ...ticket };
    newTicket.status = "In-Progress";

    const updatedTickets = tickets.map((el) =>
      el.id !== newTicket.id ? el : newTicket
    );

    setTickets(updatedTickets);
    toast("In-Progress");
  }
};
```

```js
const initialTickets = use(ticketsPromise);
const [tickets, setTickets] = useState(initialTickets);

const inProgressTickets = tickets.filter((el) => el.status === "In-Progress");
const resolvedTickets = tickets.filter((el) => el.status === "Resolved");
```

### 2. For Responsiveness:

```js
<div className="px-4">
  <div className="container mx-auto"></div>
</div>
```

## Assignment 8: Hero Apps

### 1. Sorting + IIFE: sortedInstalledApps = (()=>{})();

```js
<label className="form-control w-full max-w-xs">
  <select
    className="select select-bordered"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="none">Sort by Downloads</option>
    <option value="downloads-asc">Low-&gt;High</option>
    <option value="downloads-desc">High-&gt;Low</option>
  </select>
</label>
```

```js
const [sortOrder, setSortOrder] = useState("none");
const sortedInstalledApps = (() => {
  if (sortOrder === "downloads-asc") {
    return [...installedApps].sort((a, b) => a.downloads - b.downloads);
  } else if (sortOrder === "downloads-desc") {
    return [...installedApps].sort((a, b) => b.downloads - a.downloads);
  } else {
    return installedApps;
  }
})();
```

### 2. Handle Uninstall:

```js
const { apps, loading } = useLoadApps();
const [installedIds, setInstalledIds] = useState(getStoredAppsId());
const installedApps = apps.filter((app) => installedIds.includes(app.id));

const handleUninstall = (id) => {
  removeIdFromLS(id);
  setInstalledIds((prev) => prev.filter((storedId) => storedId !== id));
  toast("App uninstalled.");
};
```

### 3. Search Functionality:

```js
<input
  type="search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search Apps"
  className="border border-gray-400 rounded-md block bg-blue-100 outline-none py-2 px-4 max-w-xs w-full"
/>
```

```js
const { apps, loading } = useLoadApps();
const { search, setSearch } = useContext(SeacrhContext);
const searchTerm = search.trim().toLowerCase();
const searchedApps = searchTerm
  ? apps.filter((app) => app.title.toLowerCase().includes(searchTerm))
  : apps;
```

### 4. Handle Install:

```js
const { apps, loading } = useLoadApps();
const { appId } = useParams();
const convertedId = parseInt(appId);

const [installedIds, setInstalledIds] = useState(getStoredAppsId());
useEffect(() => {
  setInstalledIds(getStoredAppsId());
}, []);

if (loading) return <Loading></Loading>;

const app = apps.find((app) => app.id === convertedId);
if (!app) return <AppNotFound />;

const isInstalled = installedIds.includes(id);
const handleInstall = () => {
  addIdToLS(id);
  setInstalledIds([...installedIds, id]);
  toast("The App is installed successfully.");
};
```

### 5. Rechart:

```js
const { ratings } = app;
// "ratings": [
//       { "name": "1 star", "count": 4000000 },
//       { "name": "2 star", "count": 3000000 },
//       { "name": "3 star", "count": 12000000 },
//       { "name": "4 star", "count": 40000000 },
//       { "name": "5 star", "count": 82000000 }
//     ]

<div className="w-full h-70">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={600}
      height={300}
      data={ratings}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
    >
      <YAxis type="category" dataKey="name" stroke="#8884d8" />
      <XAxis type="number" stroke="#8884d8" />
      <Tooltip />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="count" fill="#FF8811" barSize={20} />
    </BarChart>
  </ResponsiveContainer>
</div>;
```

### 6. Loading when Search:

```js
const [searchLoading, setSearchLoading] = useState(false);
useEffect(() => {
  if (search.trim()) {
    setSearchLoading(true);
    const timeout = setTimeout(() => setSearchLoading(false), 400);
    return () => clearTimeout(timeout);
  }
}, [search]);

if (loading || searchLoading) return <Loading></Loading>;
```

### 7. Custom Hook: useLoadApps

```js
const useLoadApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios("../appsData.json") // ../ is safe for all time(deploy and local)
      .then((data) => setApps(data.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { apps, loading, error };
};
```

### 8. Local Storage:

```js
const getStoredAppsId = () => {
  const StoredIds = JSON.parse(localStorage.getItem("installedAppsId"));
  if (StoredIds) {
    return StoredIds;
  } else {
    return [];
  }
};

const addIdToLS = (id) => {
  const storedIds = getStoredAppsId("installedAppsId");
  if (storedIds.includes(id)) {
    alert("This book already exist.");
  } else {
    storedIds.push(id);
    localStorage.setItem("installedAppsId", JSON.stringify(storedIds));
  }
};

const removeIdFromLS = (id) => {
  const storedIds = getStoredAppsId("installedAppsId");
  const remainingIds = storedIds.filter((storedId) => storedId !== id);
  localStorage.setItem("installedAppsId", JSON.stringify(remainingIds));
};

export { getStoredAppsId, addIdToLS, removeIdFromLS };
```

### 9. ⚙️ React Router Deployment Setup

When deploying a React Router application (especially on platforms like Vercel, Netlify, or GitHub Pages), client-side routing can cause issues — for example, refreshing a route like `/about` may show a **404 error**.

To fix this, you need to redirect all requests to your main index.html file so the React Router can handle the routing internally.

🛠️ Steps:

1. Navigate to your project’s `public/` folder.
2. Create a new file named `_redirects` (no file extension).
3. Add the following line inside the file:

```js
/* /index.html 200
```

## Assignment 9: WarmPaws – Winter Pet Care Services

### 1. Update Profile

```js
signUpUser(email, password).then((result) => {
  const currentUser = result.user;

  updateUser({ displayName: name, photoURL: photoURL })
    .then(() => {
      setUser({ ...currentUser, displayName: name, photoURL: photoURL });
    })
    .catch((e) => {
      console.log(e);
      setUser(currentUser);
    });

  e.target.reset();
  toast.success("Account created successfully.");
  navigate("/");
});
```

### 2. Forget Password

```js
// in login page
const emailRef = useRef("");
const handleForgetPass = () => {
  const email = emailRef.current.value;
  setEmail(email);
};

<input type="email" name="email" ref={emailRef} />;
```

```js
// in AuthProvider
const [email, setEmail] = useState("");
const resetPassWord = (email) => {
  return sendPasswordResetEmail(auth, email);
};
```

```js
//in forget password page
const handleResetPassword = () => {
  resetPassWord(email)
    .then(() => {
      toast.success("Password reset email sent! Redirecting to Gmail...");
      window.location.href = "https://mail.google.com";
    })
    .catch((e) => {
      console.log(e);
    });
};
```

### 3. AuthProvider and onAuthStateChanged

```js
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUpUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };
  const googleSignUser = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  const updateUser = (updateData) => {
    return updateProfile(auth.currentUser, updateData);
  };
  const resetPassWord = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const authInfo = {
    user,
    setUser,
    loading,
    signUpUser,
    signInUser,
    signOutUser,
    googleSignUser,
    updateUser,
    resetPassWord,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};
```

### 4. Private Route

```js
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  const location = useLocation();

  if (loading) {
    return (
      <h1 className="text-center py-30">
        <span className="loading loading-bars loading-xl"></span>
      </h1>
    );
  }
  if (user) {
    return children;
  }
  return <Navigate state={location?.pathname} to={`/login`}></Navigate>;
};
```

### 5. Navigate to desired Route

```js
//in login page
const location = useLocation();
const navigate = useNavigate();

signInUser(email, password).then((result) => {
  const currUser = result.user;
  // console.log(currUser);
  e.target.reset();
  toast.success("Signed in successfully.");
  navigate(location?.state || "/");
});
```

### 6. .env.local

```js
// in .env.local
VITE_apikey=fhslflsjflafslkf
// in firebase.config.js
apiKey: import.meta.env.VITE_apiKey,
authDomain: import.meta.env.VITE_authDomain,
projectId: import.meta.env.VITE_projectId,
storageBucket: import.meta.env.VITE_storageBucket,
messagingSenderId: import.meta.env.VITE_messagingSenderId,
appId: import.meta.env.VITE_appId,
```

### 7. Add authorized domain to Firebase if you use Netlify / surge

- go to Authentication > Settings > Authorised domains

### 8. [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)

```js
// in Page
import AOS from "aos";
import "aos/dist/aos.css";

useEffect(() => {
  AOS.init({
    duration: 800,
    offset: 100,
    easing: "ease-in-out",
    once: false,
    mirror: true,
  });
}, []);
```

```js
// in Section
data-aos="fade-up"
data-aos-duration="800"
data-aos-once="false"
```

```js
// in Card
data-aos="fade-up"
data-aos-delay={serviceId * 200}
data-aos-duration="800"
data-aos-once="false"
```

### 9. [Animate.css](https://animate.style/)

```js
// in main.jsx
import "animate.css";
```

```js
// in heading
animate__animated animate__bounceInDown
```




# 🧩 Users Management — Full Setup Guide

## ⚙️ Backend Setup
### 1️⃣ Initialize the Server Project
```js
mkdir users-management-server
cd users-management-server
npm init -y
code .
```
### 2️⃣ Configure package.json

Update the scripts section:
```js
"scripts": {
  "start": "node index.js"
}
```
### 3️⃣ Install Dependencies
```js
npm install express cors
```

### 4️⃣ Create .gitignore
```js
node_modules
```
### 5️⃣ Create index.js and Add Basic Server Code
```js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Users server is running 🚀');
});

app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
```
### 6️⃣ Run the Server
```js
nodemon index.js
```

Open http://localhost:3000 in your browser.


## 👥 Users API Setup
### 7️⃣ Create Sample Users Data
```js
const users = [
  { id: 1, name: 'Rony', email: 'rony@gmail.com' },
  { id: 1, name: 'Ripon', email: 'ripon@gmail.com' }
];
```

### 8️⃣ Add GET Endpoint
```js
app.get('/users', (req, res) => {
  res.send(users);
});
```


Now, visiting http://localhost:3000/users
 should display your users array.

## 🌐 Frontend Setup
### 9️⃣ Create a Client Project
```js
npm create vite@latest users-management-client
cd users-management-client
npm install tailwindcss @tailwindcss/vite
```
### 🔟 Fetch Users from the Server
```js
useEffect(() => {
  fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => setUsers(data));
}, []);
```
### 🔁 Enable CORS in the Server
```js
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Middleware to parse JSON body
```

## 📝 Add New User (POST Request)
### ➕ Client-Side (React)
```js
const handleAddUser = (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;

  const newUser = { name, email };

  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then(data => {
      console.log('✅ User added:', data);
      setUsers([...users, data]);
      e.target.reset();
    });
};
```
### 🖥️ Server-Side (Express)
```js
app.post('/users', (req, res) => {
  console.log("📩 POST request received:", req.body);
  
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);

  res.send(newUser);
});
```
### 🔍 Debugging Notes

- If req.body is undefined, make sure you’ve included:
```js
app.use(express.json());
```

- Check Network → Headers / Payload / Preview in your browser dev tools to confirm data is sent correctly.


### ➕ update in UI
```js
const initialUsers = use(usersPromise);
const [users, setUsers] = useState(initialUsers);

console.log("data after post", data);
setUsers([...users, data]);
e.target.reset();
```


---
