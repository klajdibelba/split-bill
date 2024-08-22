import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleOnShowFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }
  function handleFriends(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend) {
    setSelectedFriend(friend);
  }
  function handleSplitBill(balance) {
    const newFriends = friends.map((friend) => {
      if (friend.id === selectedFriend.id) {
        return { ...friend, balance: friend.balance + balance };
      }

      return friend;
    });

    setFriends(newFriends);
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <ListOfFriends friends={friends} onSelection={handleSelection} />
        {showAddFriend && <FormAddFriend onAddFriend={handleFriends} />}
        <Button onClick={handleOnShowFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function ListOfFriends({ friends, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}€.
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€ .
        </p>
      )}
      {friend.balance === 0 && <p>You are even.</p>}
      <Button onClick={() => onSelection(friend)}>
        {onSelection ? "Select" : "Close"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handSubmit(e) {
    e.preventDefault();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handSubmit}>
      <label>🕺 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>🌆 Image </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setbill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const friendExpenses = bill - myExpense;
  const [whopays, setWhopays] = useState("user");

  function handSubmit(e) {
    e.preventDefault();
    let balance = -myExpense;
    if (whopays === "user") {
      balance = friendExpenses;
    }

    onSplitBill(balance);
  }

  return (
    <form className="form-split-bill" onSubmit={handSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(+e.target.value)}
      ></input>

      <label> 🧍‍♂️ Your expenses </label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) => setMyExpense(+e.target.value)}
      ></input>

      <label>🧍‍♂️🧍‍♀️ {selectedFriend.name}'s expense </label>
      <input type="text" disabled value={friendExpenses}></input>

      <label>🤩 Who is paying the bill ?</label>
      <select onChange={(e) => setWhopays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
