// PaymentManagement.tsx
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentCardForm from './PaymentCardForm';
import { jwtDecode } from 'jwt-decode';
import { Trash } from 'lucide-react';
import {toast} from 'react-toastify';
import DeleteConfirmationModal from '../components/modals/Clients/DeleteConfirmationModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  userId:string;
}
interface PaymentCard {
  _id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  stripePaymentMethodId:string;
}
const PaymentManagement = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentMethod,setPaymentMethod]=useState<PaymentCard[]>([]);
  const [cardToDelete, setCardToDelete] = useState<PaymentCard | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('authToken');
        if (!token) return;
          const decoded = jwtDecode<DecodedToken>(token);
          fetch(`http://localhost:8080/api/v1/payments-method/${decoded.userId}`)
          .then((res) => res.json())
          .then((data) => setPaymentMethod(data))
          .catch((err) => console.error('Failed to load user:', err));
    }, []);

  
 const confirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/payments-method/${cardToDelete._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete card');

      toast.success('Card deleted successfully');
      setPaymentMethod((prev) =>
        prev.filter((card) => card._id !== cardToDelete._id)
      );
    } catch (err) {
      console.error(err);
      toast.error('Error deleting card');
    } finally {
      setDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const handleSetDefaultCard = async(paymentMethodId: string) => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
          const decoded = jwtDecode<{ userId: string }>(token);
          const userId = decoded.userId;
          const res = await fetch("http://localhost:8080/api/v1/payments-method/default-card", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, paymentMethodId }),
          });
          console.log('userId',userId);
          console.log('paymentMethodId',paymentMethodId);
        const data = await res.json();
        if (res.ok) {
          toast.success('Default card updated!');
          // Optional: refresh cards after setting default
          setTimeout(() => {
            window.location.reload(); // or call refreshCards() if implemented
          }, 1000);
        } else {
          toast.error(data.error || 'Failed to update default card');
        }
      } catch (error) {
        console.error('Error setting default card:', error);
        toast.error('Server error while setting default card');
      }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Payment Methods</h2>
        <button
          onClick={() => setShowAddCard(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Add New Card
        </button>
      </div>
       {/* Payment Methods */}
        <div className="space-y-6">

          <div className="grid gap-4">
            {Array.isArray(paymentMethod) && paymentMethod.map(card => (
              <div
                key={card._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-sm font-medium uppercase">{card.brand}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      •••• {card.last4}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expires {card.expMonth}/{card.expYear}
                    </p>
                  </div>
                  {card.isDefault && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900/30 dark:text-green-400">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!card.isDefault && (
                    <button
                      onClick={() => handleSetDefaultCard(card?.stripePaymentMethodId)}
                      className="text-sm text-primary hover:text-primary-dark dark:text-primary-light"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                     onClick={() => {
              setCardToDelete(card);
              setDeleteModalOpen(true);
            }}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      {showAddCard && (
  <Elements stripe={stripePromise}>
    <PaymentCardForm onClose={() => setShowAddCard(false)} />
  </Elements>
)}
       {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDelete}
        title="Delete Client"
        message={`Are you sure you want to delete your ${cardToDelete?.brand} Card? This action cannot be undone.`}
      />
      {/* You can list existing cards here */}
    </div>
  );
};

export default PaymentManagement;