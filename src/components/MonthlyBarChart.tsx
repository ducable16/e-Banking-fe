import React, { useState } from 'react';
import './MonthlyBarChart.css';

interface MonthlyDataItem {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyBarChartProps {
  data: MonthlyDataItem[];
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data }) => {
  const [activeTooltip, setActiveTooltip] = useState<{ index: number, type: string } | null>(null);

  // Tìm giá trị lớn nhất để tính tỷ lệ
  const maxValue = Math.max(...data.flatMap(item => [item.income, item.expense]));
  const maxHeight = 80; // px

  // Tính tỷ lệ tăng/giảm giữa tháng hiện tại và tháng trước
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const expenseRatio = currentMonth.expense / previousMonth.expense;
  const isExpenseIncrease = expenseRatio > 1;

  // Format số tiền theo định dạng tiền tệ Việt Nam
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Hiển thị tooltip khi hover
  const showTooltip = (index: number, type: string) => {
    setActiveTooltip({ index, type });
  };

  // Ẩn tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="monthly-chart">
      {data.map((item, index) => {
        const incomeHeight = (item.income / maxValue) * maxHeight;
        const expenseHeight = (item.expense / maxValue) * maxHeight;
        
        // Xác định tháng hiện tại (giả sử là tháng cuối cùng trong mảng)
        const isCurrentMonth = index === data.length - 1;
        
        return (
          <div key={index} className="chart-column">
            <div className="bar-container">
              {/* Cột chi tiêu - Màu xanh */}
              <div 
                className="expense-bar"
                style={{ 
                  height: `${expenseHeight}px`,
                  opacity: isCurrentMonth ? 1 : 0.5
                }}
                onMouseEnter={() => showTooltip(index, 'expense')}
                onMouseLeave={hideTooltip}
              />
              
              {/* Cột thu nhập - Màu tím */}
              <div 
                className="income-bar"
                style={{ 
                  height: `${incomeHeight}px`,
                  opacity: isCurrentMonth ? 1 : 0.5
                }}
                onMouseEnter={() => showTooltip(index, 'income')}
                onMouseLeave={hideTooltip}
              />
              
              {/* Tooltip khi hover */}
              {activeTooltip && activeTooltip.index === index && (
                <div className={`chart-tooltip ${activeTooltip.type === 'income' ? 'income-tooltip' : 'expense-tooltip'}`}>
                  <div className="tooltip-content">
                    <strong>{activeTooltip.type === 'income' ? 'Thu' : 'Chi'}:</strong> 
                    {activeTooltip.type === 'income' 
                      ? formatCurrency(item.income)
                      : formatCurrency(item.expense)
                    }
                  </div>
                  <div className="tooltip-arrow"></div>
                </div>
              )}
            </div>
            {/* Hiển thị giá trị cho tháng hiện tại */}
            {/* {isCurrentMonth && (
              <div className="current-month-tooltip">
                <div className="tooltip-month">
                  <span className="month-value">T5</span>
                </div>
                <div className="tooltip-values">
                  <div className="expense-value">
                    Chi: {formatCurrency(item.expense)}
                  </div>
                </div>
              </div>
            )} */}
            <div className="month-label">{item.month}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyBarChart;