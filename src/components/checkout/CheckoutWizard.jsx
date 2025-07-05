'use client';

import { useState } from 'react';
import StepAddress from './StepAddress';
import StepPayment from './StepPayment';
import StepReview from './StepReview';
import OrderSummary from './OrderSummary';

const steps = ['Delivery', 'Payment', 'Review'];

export default function CheckoutWizard() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleStepClick = (index) => {
    setStep(index + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Main Form Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center space-x-2 mb-6 text-sm font-semibold select-none">
            {steps.map((label, index) => {
              const isActive = step === index + 1;
              return (
                <div key={label} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(index)}
                    type="button"
                    className={`
                      px-3 py-1 rounded 
                      transition-colors duration-200
                      ${isActive
                        ? ''
                        : 'text-gray-500 hover:text-black'}
                    `}
                    style={{
                      backgroundColor: isActive ? 'rgb(var(--yellow))' : 'transparent',
                      color: isActive ? 'black' : undefined,
                    }}
                  >
                    Step {index + 1}: {label}
                  </button>
                  {index !== steps.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleStepClick(index + 1)}
                      className="mx-2 transition-colors duration-200 text-gray-300 hover:text-black"
                      aria-label={`Go to Step ${index + 2}`}
                    >
                      ›
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dynamic Step Component */}
          {step === 1 && <StepAddress onNext={goNext} />}
          {step === 2 && <StepPayment onNext={goNext} onBack={goBack} />}
          {step === 3 && <StepReview onBack={goBack} />}
        </div>

        {/* Sidebar Summary */}
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
