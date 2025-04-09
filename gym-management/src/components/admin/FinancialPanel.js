import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../styles/AdminPanels.css';

const FinancialPanel = () => {
  const [timeFrame, setTimeFrame] = useState('daily');
  const [financialData] = useState({
    daily: {
      income: 2500,
      expenses: 1200,
      revenue: 1300,
      topSources: [
        { source: 'Memberships', amount: 1500 },
        { source: 'Personal Training', amount: 600 },
        { source: 'Supplements', amount: 400 }
      ],
      topExpenses: [
        { category: 'Staff Salaries', amount: 800 },
        { category: 'Utilities', amount: 250 },
        { category: 'Equipment Maintenance', amount: 150 }
      ]
    },
    weekly: {
      income: 15000,
      expenses: 8000,
      revenue: 7000,
      topSources: [
        { source: 'Memberships', amount: 9000 },
        { source: 'Personal Training', amount: 4000 },
        { source: 'Supplements', amount: 2000 }
      ],
      topExpenses: [
        { category: 'Staff Salaries', amount: 5000 },
        { category: 'Utilities', amount: 1800 },
        { category: 'Equipment Maintenance', amount: 1200 }
      ]
    },
    monthly: {
      income: 60000,
      expenses: 35000,
      revenue: 25000,
      topSources: [
        { source: 'Memberships', amount: 35000 },
        { source: 'Personal Training', amount: 15000 },
        { source: 'Supplements', amount: 10000 }
      ],
      topExpenses: [
        { category: 'Staff Salaries', amount: 20000 },
        { category: 'Utilities', amount: 8000 },
        { category: 'Equipment Maintenance', amount: 7000 }
      ]
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatCurrencyForPDF = (amount, isExpense = false) => {
    const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${isExpense ? '-' : '+'} ${formattedAmount},00 TL`;
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

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Financial Overview</h2>
        <div className="header-actions">
          <div className="timeframe-selector">
            <button 
              className={`timeframe-btn ${timeFrame === 'daily' ? 'active' : ''}`}
              onClick={() => setTimeFrame('daily')}
            >
              Daily
            </button>
            <button 
              className={`timeframe-btn ${timeFrame === 'weekly' ? 'active' : ''}`}
              onClick={() => setTimeFrame('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`timeframe-btn ${timeFrame === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeFrame('monthly')}
            >
              Monthly
            </button>
          </div>
          <button className="print-btn" onClick={handlePrint}>
            <i className="fas fa-download"></i> Download Report
          </button>
        </div>
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