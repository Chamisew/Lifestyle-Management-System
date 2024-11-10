import "./Transactions.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import Swal from "sweetalert2"; // Still keep for deletion alerts
import { iconsImgs } from "../../utils/images";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    image: null
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load transactions. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:5000/api/transactions", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const newTransaction = { ...response.data, image: URL.createObjectURL(formData.image) };
      setTransactions((prev) => [...prev, newTransaction]);
      setModalIsOpen(false); // Close modal
      Swal.fire({
        icon: 'success',
        title: 'Income Added',
        text: 'Your transaction has been added successfully!',
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Error adding transaction: ${errorMessage}`,
      });
    }
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleAddTransactionClick = () => {
    setModalIsOpen(true);
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTransactions((prev) => prev.filter((transaction) => transaction._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Transaction Deleted',
        text: 'Your transaction has been deleted successfully!',
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error deleting transaction, please try again.',
      });
    }
  };

  if (loading) {
    return <div>Loading Incomes...</div>;
  }

  const today  = new Date().toISOString().split('T')[0];

  return (
    <div className="grid-one-item grid-common grid-c2">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Special Incomes</h3>
        <button className="grid-c-title-icon" onClick={handleAddTransactionClick}>
          <img src={iconsImgs.plus} alt="Add Transaction" />
        </button>
      </div>

      <div className="grid-content">
        <div className="grid-items">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div className="grid-item" key={transaction._id}>
                <div className="grid-item-l">
                  <div className="avatar img-fit-cover">
                    <img
                      src={transaction.image || '/images/default-image.png'}
                      alt={transaction.name}
                      className="img-small"
                    />
                  </div>
                  <p className="text">
                    {transaction.name} <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="grid-item-r">
                  <span className="text-scarlet">LKR {transaction.amount.toFixed(2)}</span><br />
                  <button style={{ color: 'gray' }} onClick={() => deleteTransaction(transaction._id)} className="income-delete-button">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No Income available.</p>
          )}
        </div>
      </div>

      {/* Modal for adding transactions */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add Transaction"
      >
        <h2>Add Income</h2>
        <form onSubmit={(e) => { e.preventDefault(); addTransaction(); }}>
          <input
            type="text"
            name="name"
            placeholder="Person Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            max={today}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Transaction</button>
        </form>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default Transactions;
