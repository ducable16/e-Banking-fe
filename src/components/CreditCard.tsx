import React, { useMemo } from 'react';
import './CreditCard.css';

interface CreditCardProps {
  cardNumber?: string;
  cardholderName: string;
  expiryDate?: string;
  cardType?: 'VISA' | 'MASTERCARD' | 'JCB';
  promotion?: string;
  className?: string;
  isHiddenNumber?: boolean;
  useRandomGradient?: boolean; // Thêm prop để bật/tắt gradient ngẫu nhiên
}

const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber = '**** **** **** 1234',
  cardholderName,
  expiryDate = '05/28',
  cardType = 'VISA',
  promotion,
  className = '',
  isHiddenNumber = true,
  useRandomGradient = false // Mặc định là false
}) => {
  // Xử lý hiển thị số thẻ (ẩn hoặc hiện)
  const formatCardNumber = () => {
    if (isHiddenNumber) return '**** **** **** ' + cardNumber.slice(-4);
    
    // Format số thẻ theo nhóm 4 chữ số
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Tạo gradient ngẫu nhiên
  const randomGradient = useMemo(() => {
    if (!useRandomGradient) return {};
    
    // Danh sách các màu gradient đẹp
    const gradients = [
      'linear-gradient(135deg, #0061ff, #60efff)',
      'linear-gradient(135deg, #ff0844, #ffb199)',
      'linear-gradient(135deg, #8e2de2, #4a00e0)',
      'linear-gradient(135deg, #f6d365, #fda085)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4)',
      'linear-gradient(135deg, #5ee7df, #b490ca)',
      'linear-gradient(135deg, #c471f5, #fa71cd)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #0ba360, #3cba92)',
      'linear-gradient(135deg, #ff758c, #ff7eb3)',
      'linear-gradient(135deg, #6a11cb, #2575fc)',
      'linear-gradient(135deg, #f77062, #fe5196)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #fdfcfb, #e2d1c3)'
    ];
    
    // Chọn ngẫu nhiên một gradient từ danh sách
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return {
      background: gradients[randomIndex]
    };
  }, [useRandomGradient]);

  // Chọn class dựa vào cardType nếu không sử dụng random gradient
  const cardClass = useRandomGradient ? 'custom-gradient' : cardType.toLowerCase();

  return (
    <div 
      className={`credit-card ${className} ${cardClass}`}
      style={useRandomGradient ? randomGradient : {}}
    >
      <div className="card-overlay">
        {/* Phần trên của card */}
        <div className="card-top">
          {/* Chip của thẻ */}
          <div className="card-chip"></div>
          
          {/* Logo của loại thẻ */}
          <div className="card-logo">{cardType}</div>
        </div>
        
        {/* Số thẻ */}
        <div className="card-number">{formatCardNumber()}</div>
        
        {/* Thông tin chủ thẻ và hạn sử dụng */}
        <div className="card-bottom">
          <div className="card-info-grid">
            <div className="card-holder-area">
              <div className="card-label">CARDHOLDER</div>
              <div className="card-name">{cardholderName}</div>
            </div>
            <div className="card-expiry-area">
              <div className="card-label">EXPIRES</div>
              <div>{expiryDate}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hiển thị thông tin khuyến mãi nếu có */}
      {promotion && <div className="card-promotion">{promotion}</div>}
    </div>
  );
};

export default CreditCard;