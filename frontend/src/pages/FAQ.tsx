import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do I track my laundry order?',
    answer: 'You can track your order status in real-time through the Orders page. Each order has a unique ID and shows its current status, from pickup to delivery.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards and wallet payments. You can manage your payment methods in the Payment Management section.'
  },
  {
    question: 'How do I schedule a pickup?',
    answer: 'Go to the Orders page and click "Add Manual Order". Select your preferred pickup date and time, and our delivery personnel will arrive within the specified window.'
  },
  {
    question: 'What happens if items are damaged?',
    answer: 'We take utmost care of your items. In the rare case of damage, please report it within 24 hours of delivery. Our support team will assist you with the claim process.'
  },
  {
    question: 'How are pricing plans determined?',
    answer: 'Pricing plans are based on your business type (Hospital, Hotel, or Salon) and expected order volume. You can view and compare different plans in the Subscription Plans section.'
  },
  {
    question: 'Can I change my subscription plan?',
    answer: 'Yes, you can upgrade or downgrade your subscription plan at any time. Changes will take effect at the start of your next billing cycle.'
  }
];

function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {faqData.map((item, index) => (
          <div key={index} className="p-6">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {item.question}
              </h3>
              {openItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openItems.includes(index) && (
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;