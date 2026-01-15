import React, { useState, useEffect } from 'react';

export interface ApprovalRateProps {
  /** Գլխավոր վերնագիր */
  title?: string;
  /** Ենթավերնագիր */
  subtitle?: string;
  /** Հաստատման տոկոս (0-100) */
  approvalPercentage?: number;
  /** Հաստատված փաստաթղթերի քանակ */
  approvedCount?: number;
  /** Տեսականու անվանում (օր. "Document", "Quote", "Request", և այլն) */
  typeLabel?: string;
  /** Կարգավորումներ թարմացման համար */
  autoUpdate?: boolean;
  /** Թարմացման ինտերվալ (միլիվայրկյաններով) */
  updateInterval?: number;
  /** Callback, երբ տոկոսը փոխվում է */
  onPercentageChange?: (percentage: number) => void;
  /** Հատուկ գույներ */
  colors?: {
    primary?: string;
    secondary?: string;
    progressStart?: string;
    progressEnd?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
  /** Ցուցադրել առաջադեմ ցուցիչը */
  showAdvancedIndicator?: boolean;
}

export const ApprovalRate: React.FC<ApprovalRateProps> = ({
  title = 'Document Approval Rate',
  subtitle = 'Shows the percentage of approved documents.',
  approvalPercentage = 85,
  approvedCount = 85,
  typeLabel = 'Document',
  autoUpdate = false,
  updateInterval = 5000,
  onPercentageChange,
  colors = {
    primary: '#000000',
    secondary: '#c7c7c7',
    progressStart: 'rgba(216, 228, 254, 0.52)',
    progressEnd: 'rgba(39, 100, 235, 0.35)',
    textPrimary: '#000000',
    textSecondary: '#c7c7c7'
  },
  showAdvancedIndicator = true
}) => {
  const [percentage, setPercentage] = useState(approvalPercentage);
  const [count, setCount] = useState(approvedCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Ավտոմատ թարմացում
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      const randomChange = Math.floor(Math.random() * 5) - 2; // -2-ից +2
      const newPercentage = Math.max(0, Math.min(100, percentage + randomChange));
      const newCount = Math.max(0, Math.min(100, count + randomChange));
      
      setIsAnimating(true);
      setAnimationProgress(0);
      
      // Անիմացիայի տևողությունը
      const animationDuration = 500;
      const steps = 60;
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      const animate = () => {
        if (currentStep > steps) {
          setIsAnimating(false);
          setPercentage(newPercentage);
          setCount(newCount);
          if (onPercentageChange) {
            onPercentageChange(newPercentage);
          }
          return;
        }
        
        setAnimationProgress(currentStep / steps);
        currentStep++;
        setTimeout(animate, stepDuration);
      };
      
      animate();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [autoUpdate, updateInterval, percentage, count, onPercentageChange]);

  // Սկզբնական արժեքների սահմանում
  useEffect(() => {
    setPercentage(approvalPercentage);
    setCount(approvedCount);
  }, [approvalPercentage, approvedCount]);

  // Հաշվարկել անիմացիայի արժեքը
  const animatedPercentage = isAnimating 
    ? percentage + (approvalPercentage - percentage) * animationProgress
    : percentage;

  const animatedCount = isAnimating
    ? Math.round(count + (approvedCount - count) * animationProgress)
    : count;

  // Հաշվարկել առաջընթացի գույնը
  const getProgressGradient = () => {
    if (isAnimating) {
      const intensity = 0.5 + 0.5 * Math.sin(animationProgress * Math.PI * 4);
      return `linear-gradient(
        180deg,
        rgba(255, 255, 200, ${0.3 + intensity * 0.3}) 0%,
        rgba(255, 200, 100, ${0.2 + intensity * 0.2}) 100%
      )`;
    }
    
    return `linear-gradient(
      180deg,
      ${colors.progressStart} 0%,
      ${colors.progressEnd} 100%
    )`;
  };

  return (
    <article 
      className="frame approval-rate-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '24px',
        padding: '16px',
        position: 'relative',
        backgroundColor: '#fafcfc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Վերնագիր և ենթավերնագիր */}
      <header 
        className="approval-rate-header"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          width: '100%',
          flex: '0 0 auto',
          position: 'relative'
        }}
      >
        <h1 
          className="approval-rate-title"
          style={{
            position: 'relative',
            alignSelf: 'stretch',
            marginTop: '-1px',
            fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
            fontWeight: 500,
            color: colors.textPrimary,
            fontSize: '18px',
            letterSpacing: '0.36px',
            lineHeight: 'normal',
            margin: 0
          }}
        >
          {title}
        </h1>
        <p 
          className="approval-rate-subtitle"
          style={{
            position: 'relative',
            alignSelf: 'stretch',
            fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
            fontWeight: 500,
            color: colors.textSecondary,
            fontSize: '14px',
            letterSpacing: '0.28px',
            lineHeight: 'normal',
            margin: 0
          }}
        >
          {subtitle}
        </p>
      </header>

      {/* Տոկոսի ցուցադրում */}
      <section 
        className="approval-percentage-section"
        aria-label="Approval percentage"
        style={{
          position: 'relative',
          width: '161px',
          height: '40px'
        }}
      >
        <div 
          className="percentage-container"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            gap: '4px',
            width: '76px',
            height: '38px',
            alignItems: 'flex-start'
          }}
        >
          <span 
            className="percentage-symbol"
            aria-hidden="true"
            style={{
              width: '9px',
              height: '12px',
              fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: colors.textPrimary,
              fontSize: '10px',
              letterSpacing: '0.20px',
              lineHeight: 'normal',
              whiteSpace: 'nowrap',
              paddingTop: '6px'
            }}
          >
            %
          </span>
          <span 
            className="percentage-value"
            style={{
              marginTop: '2px',
              width: '59px',
              height: '36px',
              fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: colors.textPrimary,
              fontSize: '48px',
              letterSpacing: '0.96px',
              lineHeight: '36px',
              whiteSpace: 'nowrap',
              transition: isAnimating ? 'all 0.3s ease' : 'none',
              transform: isAnimating ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {Math.round(animatedPercentage)}
          </span>
        </div>
        <span 
          className="type-label"
          style={{
            position: 'absolute',
            top: '25px',
            left: '91px',
            fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
            fontWeight: 500,
            color: colors.textSecondary,
            fontSize: '12px',
            letterSpacing: '0.24px',
            lineHeight: 'normal'
          }}
        >
          {typeLabel}
        </span>
      </section>

      {/* Առաջընթացի տող */}
      <section 
        className="progress-section"
        aria-label="Document approval progress"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '348px',
          height: '68px'
        }}
      >
        <div 
          className="progress-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {/* Վերնագիր և քանակ */}
          <div 
            className="progress-header"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <div 
              className="count-display"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '17px',
                position: 'relative'
              }}
            >
              <span 
                className="progress-title"
                style={{
                  position: 'relative',
                  width: 'fit-content',
                  fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  fontSize: '12px',
                  letterSpacing: '0.24px',
                  lineHeight: 'normal'
                }}
              >
                Documents Approved
              </span>
              <span 
                className="progress-count"
                style={{
                  position: 'relative',
                  width: 'fit-content',
                  marginTop: '-1px',
                  fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  color: colors.textSecondary,
                  fontSize: '14px',
                  letterSpacing: '0.28px',
                  lineHeight: 'normal',
                  transition: isAnimating ? 'all 0.3s ease' : 'none'
                }}
              >
                {animatedCount}
              </span>
            </div>
          </div>

          {/* Առաջընթացի տող */}
          <div 
            className="progress-bar-container"
            style={{
              marginTop: '6px',
              width: '100%',
              height: '24px',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex'
            }}
          >
            <div 
              className="progress-bar-fill"
              role="progressbar"
              aria-valuenow={animatedPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Document approval progress bar"
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                width: `${animatedPercentage}%`,
                height: '100%',
                background: getProgressGradient(),
                borderRadius: '4px',
                transition: isAnimating ? 'width 0.5s ease' : 'width 0.3s ease',
                boxShadow: isAnimating ? '0 0 10px rgba(255, 200, 100, 0.5)' : 'none',
                zIndex: 2
              }}
            >
              <div 
                className="progress-indicator"
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '18px',
                  backgroundColor: '#f6f8fa',
                  borderRadius: '1px'
                }}
              />
            </div>
            
            {/* Առաջադեմ ցուցիչ (գծիկներ) */}
            {showAdvancedIndicator && (
              <div 
                className="advanced-indicator-container"
                style={{
                  top: 0,
                  left: 0,
                  width: `${100 - animatedPercentage}%`,
                  height: '100%',
                  display: 'inline-flex',
                  gap: '4.5px',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  overflow: 'hidden',
                  paddingBottom: '4px',
                  zIndex: 1,
                  marginLeft: '-2px'
                }}
              >
                {Array.from({ length: 40 }).map((_, index) => (
                  <div
                    key={index}
                    className="indicator-line"
                    style={{
                      width: '1px',
                      height: '18px',
                      backgroundColor: '#E8E8E8',
                      flexShrink: 0,
                      transform: 'scaleX(2.7)'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Սանդղակ */}
          <div 
            className="progress-scale"
            style={{
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '17px',
              position: 'relative'
            }}
          >
            <span 
              className="scale-min"
              style={{
                position: 'relative',
                width: 'fit-content',
                marginTop: '-1px',
                fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
                fontSize: '14px',
                letterSpacing: '0.28px',
                lineHeight: 'normal'
              }}
            >
              0
            </span>
            <span 
              className="scale-max"
              style={{
                position: 'relative',
                width: 'fit-content',
                marginTop: '-1px',
                fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
                fontSize: '14px',
                letterSpacing: '0.28px',
                lineHeight: 'normal'
              }}
            >
              100
            </span>
          </div>
        </div>
      </section>

      {/* Հավելյալ ոճեր */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .approval-rate-container {
          transition: all 0.3s ease;
        }
        
        .approval-rate-container:hover {
          
        }
        
        .progress-bar-fill {
          animation: ${isAnimating ? 'pulse 0.5s ease-in-out infinite' : 'none'};
        }
        
        @media screen and (max-width: 768px) {
          .frame {
            padding: 16px;
            gap: 16px;
          }
          
          .approval-rate-title {
            font-size: 16px;
          }
          
          .approval-rate-subtitle {
            font-size: 12px;
          }
          
          .percentage-value {
            font-size: 36px;
          }
        }
      `}</style>
    </article>
  );
};