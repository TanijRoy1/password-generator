## React Core Concept


## 1. What is `JSX`, and why is it used?

JSX (JavaScript XML) is a syntax extension that lets us write **HTML-like code inside JavaScript**.
### Example:
```js
const element = <h1>Hello, world!</h1>;
````
### Why use it:

- Easier to read and write UI code.

- Allows us to describe the UI structure in a way that looks like HTML.

- React converts JSX into `React.createElement()` calls behind the scenes, which creates virtual DOM elements.


---



## 2. What is the difference between `State` and `Props`?

### State:

- Data local to a component that can change.

- Mutable using `setState` or `useState`.

- Example: a counter value inside a component.

### Props:

- Data passed from parent to child component.

- Read-only inside the child component.

- Example: `<Child title="Hello" />`

---



## 3. What is the `useState` hook, and how does it work?

`useState` is a React hook that allows us to add state to a functional component.

### Example:
```js
const [count, setCount] = useState(0);
````

### How it works:

- `useState` returns an array with two items:

  1. The current state (`count`)

  2. A function to update the state (`setCount`)

- Calling the setter (`setCount`) triggers a **re-render** with the new state.

---



## 4. How can you share state between components in React?

**Lifting State Up**: Move state to the closest common parent and pass it as props to children.

### Example:
```js
function Parent() {
  const [value, setValue] = useState(0);
  return (
    <>
      <Child1 value={value} setValue={setValue} />
      <Child2 value={value} />
    </>
  );
}
````


---

## 5. How is `event` handling done in React?

React handles `events` similarly to HTML but with some differences:

- React uses camelCase for event names, like `onClick` or `onChange`.

- We pass a function to handle the event.

### Example:
```js
function Button() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return <button onClick={handleClick}>Click me</button>;
}
````



---

