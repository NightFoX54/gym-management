import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../styles/AdminPanels.css';
import axios from 'axios';

const FinancialPanel = () => {
  const [timeFrame, setTimeFrame] = useState('daily');
  const [financialData, setFinancialData] = useState({
    daily: {
      income: 0,
      expenses: 0,
      revenue: 0,
      topSources: [],
      topExpenses: []
    },
    weekly: {
      income: 0,
      expenses: 0,
      revenue: 0,
      topSources: [],
      topExpenses: []
    },
    monthly: {
      income: 0,
      expenses: 0,
      revenue: 0,
      topSources: [],
      topExpenses: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/financial/dashboard');
        
        // Log the response for debugging
        console.log('API Response:', response.data);
        
        // Get data from response
        const { expenses, incomes } = response.data;
        
        // Restructure data to match expected format
        const processedData = {
          daily: {
            income: incomes.dailyTotal || 0,
            expenses: expenses.dailyTotal || 0,
            revenue: (incomes.dailyTotal || 0) - (expenses.dailyTotal || 0),
            topSources: Array.isArray(incomes.daily) 
              ? incomes.daily.slice(0, 3).map(item => ({
                  source: item.category,
                  amount: item.amount
                }))
              : [],
            topExpenses: Array.isArray(expenses.daily) 
              ? expenses.daily.slice(0, 3) 
              : []
          },
          weekly: {
            income: incomes.weeklyTotal || 0,
            expenses: expenses.weeklyTotal || 0,
            revenue: (incomes.weeklyTotal || 0) - (expenses.weeklyTotal || 0),
            topSources: Array.isArray(incomes.weekly) 
              ? incomes.weekly.slice(0, 3).map(item => ({
                  source: item.category,
                  amount: item.amount
                }))
              : [],
            topExpenses: Array.isArray(expenses.weekly) 
              ? expenses.weekly.slice(0, 3) 
              : []
          },
          monthly: {
            income: incomes.monthlyTotal || 0,
            expenses: expenses.monthlyTotal || 0,
            revenue: (incomes.monthlyTotal || 0) - (expenses.monthlyTotal || 0),
            topSources: Array.isArray(incomes.monthly) 
              ? incomes.monthly.slice(0, 3).map(item => ({
                  source: item.category,
                  amount: item.amount
                }))
              : [],
            topExpenses: Array.isArray(expenses.monthly) 
              ? expenses.monthly.slice(0, 3) 
              : []
          }
        };
        
        setFinancialData(processedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to fetch financial data. Please try again later.');
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatCurrencyForPDF = (amount, isExpense = false) => {
    // Format with 2 decimal places and proper thousand separators
    const absAmount = Math.abs(amount);
    const integerPart = Math.floor(absAmount);
    const decimalPart = Math.round((absAmount - integerPart) * 100);
    
    // Format integer part with dot separators for thousands
    const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Combine with properly formatted decimal part
    const formattedAmount = `${formattedInteger},${decimalPart.toString().padStart(2, '0')}`;
    
    return `${isExpense ? '-' : '+'} ${formattedAmount} TL`;
  };

  const currentData = financialData[timeFrame];

  const handlePrint = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFont("helvetica");
    
    // Add company logo/header
    doc.setFontSize(22);
    doc.text('GymFlex', doc.internal.pageSize.width/2, 40, { align: 'center' });
    
    // Add report title
    doc.setFontSize(18);
    doc.text(`Financial Report - ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}`, doc.internal.pageSize.width/2, 70, { align: 'center' });
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(40, 85, doc.internal.pageSize.width - 40, 85);

    // Add date and report info
    doc.setFontSize(11);
    doc.text(`Report Generated: ${new Date().toLocaleString('tr-TR')}`, 40, 110);
    doc.text(`Time Period: ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}`, 40, 125);

    // Add summary section
    doc.setFontSize(14);
    doc.text('Financial Summary', 40, 150);
    
    // Add summary table with custom styles for Net Revenue
    doc.autoTable({
      startY: 160,
      head: [['Category', 'Amount']],
      body: [
        ['Total Income', formatCurrencyForPDF(currentData.income)],
        ['Total Expenses', formatCurrencyForPDF(currentData.expenses, true)],
        ['Net Revenue', formatCurrencyForPDF(currentData.revenue)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [45, 45, 45] },
      styles: { 
        fontSize: 12, 
        font: "helvetica",
        cellPadding: 8
      },
      margin: { left: 40, right: 40 },
      bodyStyles: { textColor: [0, 0, 0] },
      didParseCell: function(data) {
        if (data.row.index === 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 13;
        }
      }
    });

    // Add income sources section
    doc.setFontSize(14);
    doc.text('Income Sources Breakdown', 40, doc.lastAutoTable.finalY + 40);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 50,
      head: [['Source', 'Amount', 'Percentage']],
      body: currentData.topSources.map(source => [
        source.source,
        formatCurrencyForPDF(source.amount),
        `${((source.amount / currentData.income) * 100).toFixed(1)}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [45, 45, 45] },
      styles: { 
        fontSize: 12, 
        font: "helvetica",
        cellPadding: 8
      },
      margin: { left: 40, right: 40 }
    });

    // Add expenses section
    doc.setFontSize(14);
    doc.text('Expenses Breakdown', 40, doc.lastAutoTable.finalY + 40);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 50,
      head: [['Category', 'Amount', 'Percentage']],
      body: currentData.topExpenses.map(expense => [
        expense.category,
        formatCurrencyForPDF(expense.amount, true),
        `${((expense.amount / currentData.expenses) * 100).toFixed(1)}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [45, 45, 45] },
      styles: { 
        fontSize: 12, 
        font: "helvetica",
        cellPadding: 8
      },
      margin: { left: 40, right: 40 }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width/2,
        doc.internal.pageSize.height - 20,
        { align: 'center' }
      );
      doc.text(
        'GymFlex Financial Report',
        40,
        doc.internal.pageSize.height - 20
      );
    }

    // Save the PDF
    doc.save(`GymFlex_Financial_Report_${timeFrame}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="loading">Loading financial data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Financial Dashboard</h2>
        <div className="time-filter">
          <button 
            className={timeFrame === 'daily' ? 'active' : ''} 
            onClick={() => setTimeFrame('daily')}
          >
            Daily
          </button>
          <button 
            className={timeFrame === 'weekly' ? 'active' : ''} 
            onClick={() => setTimeFrame('weekly')}
          >
            Weekly
          </button>
          <button 
            className={timeFrame === 'monthly' ? 'active' : ''} 
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </button>
        </div>
        <button className="print-btn" onClick={handlePrint}>
          <i className="fas fa-download"></i> Download Report
        </button>
      </div>

      <div className="financial-summary">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p>{formatCurrency(currentData.income)}</p>
        </div>
        <div className="summary-card expenses">
          <h3>Total Expenses</h3>
          <p>{formatCurrency(currentData.expenses)}</p>
        </div>
        <div className="summary-card revenue">
          <h3>Net Revenue</h3>
          <p>{formatCurrency(currentData.revenue)}</p>
        </div>
      </div>

      <div className="financial-details">
        <div className="income-sources">
          <h3>Top Income Sources</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentData.topSources.map((source, index) => (
                <tr key={index}>
                  <td>{source.source}</td>
                  <td>{formatCurrency(source.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="expense-categories">
          <h3>Top Expenses</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentData.topExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.category}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialPanel; 