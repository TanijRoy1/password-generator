## Assignment 7: Customer Support Zone

### Change status and arrange updatedTickets by id:
```js
const handleInProgress = (ticket) => {
  if (ticket.status === "Open") {
    const newTicket = {...ticket};
    newTicket.status = "In-Progress"
            
    const updatedTickets = tickets.map(el => 
    el.id !== newTicket.id ? el : newTicket);
            
    setTickets(updatedTickets);
    toast("In-Progress");
  }
}
````
```js
const initialTickets = use(ticketsPromise);
const [tickets, setTickets] = useState(initialTickets);

const inProgressTickets = tickets.filter(el => el.status === "In-Progress");
const resolvedTickets = tickets.filter(el => el.status === "Resolved");
```

### For Responsiveness: 

```js
<div className="px-4">
  <div className="container mx-auto">
  </div>
</div>
```
 



## Assignment 8: Hero Apps

### Sorting + IIFE: sortedInstalledApps = (()=>{})();
```js
<label className="form-control w-full max-w-xs">
   <select
     className="select select-bordered"
     value={sortOrder}
     onChange={e => setSortOrder(e.target.value)}
   >
     <option value="none">Sort by Downloads</option>
     <option value="downloads-asc">Low-&gt;High</option>
     <option value="downloads-desc">High-&gt;Low</option>
   </select>
</label>
```
```js
const [sortOrder, setSortOrder] = useState('none');
const sortedInstalledApps = (() => {
  if (sortOrder === 'downloads-asc') {
    return [...installedApps].sort((a, b) => a.downloads - b.downloads);
  } else if (sortOrder === 'downloads-desc') {
    return [...installedApps].sort((a, b) => b.downloads - a.downloads);
  } else {
    return installedApps;
  }
})();
```

### Handle Uninstall:
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

### Search Functionality:
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
const searchedApps = searchTerm ? 
    apps.filter((app) => app.title.toLowerCase().includes(searchTerm))
  : apps;
```

### Handle Install:
```js
const { apps, loading } = useLoadApps();
const { appId } = useParams();
const convertedId = parseInt(appId);

const [installedIds, setInstalledIds] = useState(getStoredAppsId());
useEffect(() => {
  setInstalledIds(getStoredAppsId());
}, [])

if (loading) return <Loading></Loading>;

const app = apps.find((app) => app.id === convertedId);
if (!app) return <AppNotFound />;

const isInstalled = installedIds.includes(id);
const handleInstall = () => {
  addIdToLS(id);
  setInstalledIds([...installedIds, id]);
  toast("The App is installed successfully.");
}
```

### Rechart:
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
</div>
```
### Loading when Search:
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
### Custom Hook: useLoadApps
```js
const useLoadApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
      setLoading(true);
      axios("../appsData.json") // ../ is safe for all time(deploy and local)
        .then(data => setApps(data.data))
        .catch(err => setError(err))
        .finally(() => setLoading(false))
  }, [])

  return {apps, loading, error};
};
```

### Local Storage:
```js
const getStoredAppsId = () => {
  const StoredIds = JSON.parse(localStorage.getItem("installedAppsId"));
  if (StoredIds) {
      return StoredIds;
  } else {
      return [];
  }
}

const addIdToLS = (id) => {
  const storedIds = getStoredAppsId("installedAppsId");
  if (storedIds.includes(id)) {
      alert("This book already exist.");
  } else {
      storedIds.push(id);
      localStorage.setItem("installedAppsId", JSON.stringify(storedIds));
  }
}

const removeIdFromLS = (id) => {
  const storedIds = getStoredAppsId("installedAppsId");
  const remainingIds = storedIds.filter(storedId => storedId !== id);
  localStorage.setItem("installedAppsId", JSON.stringify(remainingIds));
}

export {getStoredAppsId, addIdToLS, removeIdFromLS};
```

### ⚙️ React Router Deployment Setup
When deploying a React Router application (especially on platforms like Vercel, Netlify, or GitHub Pages), client-side routing can cause issues — for example, refreshing a route like `/about` may show a **404 error**.

To fix this, you need to redirect all requests to your main index.html file so the React Router can handle the routing internally.

🛠️ Steps:
1. Navigate to your project’s `public/` folder.
2. Create a new file named `_redirects` (no file extension).
3. Add the following line inside the file:
```js
/* /index.html 200
```

---