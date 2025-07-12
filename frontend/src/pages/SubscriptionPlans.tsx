import { useEffect, useState } from 'react';
import { Check, X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createSubscription } from '../utils/stripe';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  userId: string;
  role: string;
}

interface Plan {
  _id: string;
  plan_name: string;
  plan_description: string;
  business_type: string;
  billing_options: string;
  price: number;
  features: string[];
  stripePriceId: string;
}

function SubscriptionPlans() {
  const { user } = useAuth();
 
  const selectedType = user?.role;
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
    if (!token || !selectedType) return;
    const decoded = jwtDecode<DecodedToken>(token);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/subscription-plans/${selectedType.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error('Failed to load plans:', err));
  }, [selectedType]);

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlan || !user) return;

    setLoading(true);
    console.log(JSON.stringify(selectedPlan),'selectedPlan');
    try {
      const priceId =selectedPlan.stripePriceId;

      await createSubscription({
        userId: decoded.userId,
        email: user.email,
        priceId,
        planName: selectedPlan.plan_name,
        billingType: billing,
      });

      // toast will be triggered inside `createSubscription`
      setShowModal(false);
      navigate('/subscription-history');
    } catch (error) {
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedType) {
    return <div className="text-center text-red-500">Business type not assigned to user.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Subscription Plans</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-0.5 flex">
            <button
              onClick={() => setBilling('monthly')}
              className={`relative w-28 rounded-md m-1 py-2 text-sm font-medium focus:outline-none ${
                billing === 'monthly' ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`relative w-28 rounded-md m-1 py-2 text-sm font-medium focus:outline-none ${
                billing === 'yearly' ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans
            .filter(plan => plan.billing_options.includes(billing))
            .map((plan) => (
              <div
                key={plan._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border"
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.plan_name}</h3>
                  <p className="dark:text-white">{plan.plan_description}</p>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-2xl text-gray-900 dark:text-white">
                      INR {billing === 'monthly' ? plan.price : plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                      /{billing.charAt(0).toUpperCase() + billing.slice(1)}
                    </span>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    className="mt-8 w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg text-sm font-semibold"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Subscription</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You are about to subscribe to the {selectedPlan.plan_name} plan.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Plan:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedPlan.plan_name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Billing:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{billing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      INR {billing === 'yearly' ? selectedPlan.price : selectedPlan.price}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubscription}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPlans;
