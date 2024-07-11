import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

const ProgressBar = ({ steps, currentStep, setCurrentStep }) => {
  const getStepStatus = (index) => {
    if (index < currentStep) return 'complete';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.name} className={classNames(index !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
            {getStepStatus(index) === 'complete' ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <button
                  onClick={() => setCurrentStep(index)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900"
                >
                  <CheckIcon aria-hidden="true" className="h-5 w-5 text-white" />
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            ) : getStepStatus(index) === 'current' ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <button
                  onClick={() => setCurrentStep(index)}
                  aria-current="step"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                >
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            ) : (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <button
                  onClick={() => setCurrentStep(index)}
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                  />
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressBar;
