import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Row, Col } from 'antd';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import '../styles/payoutDetails.css';

export function PayoutDetails() {
  const [payoutPriceList, setPayoutPriceList] = useState([]);
  const [savingGoogleSheet, setSavingGoogleSheet] = useState(false);

  const calculateTotalPayout = (articles, payoutRate) => articles * payoutRate;

  const columns = [
    { title: 'Author', dataIndex: 'name', key: 'name' },
    { title: 'Articles', dataIndex: 'articles', key: 'articles' },
    { title: 'Payout Rate in $', dataIndex: 'payoutRate', key: 'payoutRate' },
    {
      title: 'Total Payout in $',
      dataIndex: 'totalPayout',
      key: 'totalPayout',
      render: (_, record) => calculateTotalPayout(record.articles, record.payoutRate),
    },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Payout Report', 20, 20);

    autoTable(doc, {
      startY: 30,
      head: [columns.map((col) => col.title)],
      body: payoutPriceList.map((item) => [
        item.name,
        item.articles,
        item.payoutRate,
        calculateTotalPayout(item.articles, item.payoutRate),
      ]),
      theme: 'striped',
      styles: { cellWidth: 'auto', fontSize: 12, overflow: 'linebreak' },
    });

    doc.save(`payout_report_${Date.now()}.pdf`);
  };

  const handleSubmit = () => {
    setSavingGoogleSheet(true);
    const url =
      'https://script.google.com/macros/s/AKfycbwFM2U_-ePaw6svEjc-bzKv_k0rXmkQGQRlyLfOq0qj9cwKJU-wj8tuISrzvIAZVRBXfg/exec';

    let successCount = 0;
    let errorCount = 0;

    for (let ele of payoutPriceList) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `name=${encodeURIComponent(ele.name)}&articles=${encodeURIComponent(
          ele.articles
        )}&payoutRate=${encodeURIComponent(ele.payoutRate)}&totalPayout=${encodeURIComponent(
          calculateTotalPayout(ele.articles, ele.payoutRate)
        )}`,
      })
        .then((res) => res.text())
        .then((data) => {
          console.log(`Success for: ${ele.name}`, data);
          successCount++;
        })
        .catch((error) => {
          console.error(`Error for: ${ele.name}`, error);
          errorCount++;
        })
        .finally(() => {
          if (successCount + errorCount === payoutPriceList.length) {
            if (errorCount > 0) {
              alert(`Updated with ${errorCount} errors.`);
            } else {
              alert('All data updated successfully!');
            }

            setSavingGoogleSheet(false);
            window.open(
              'https://docs.google.com/spreadsheets/d/1tRseUHpQVHp-bH8qZI7OcrGGQL4KRA_56Dzf6hd1S6o/edit?gid=0#gid=0'
            );
          }
        });
    }
  };

  useEffect(() => {
    const payoutDetailsArr = JSON.parse(localStorage.getItem('payoutDetailsArr')) || [];
    setPayoutPriceList(payoutDetailsArr);
  }, []);

  return (
    <div className="payoutDiv">
      <p className="payoutDetails">Payout Details</p>

      {/* Responsive Button Section */}
      <Row gutter={[16, 16]} justify="center" className="buttonOptions">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button type="primary" block onClick={generatePDF}>
            Download as PDF
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button type="primary" block>
            <CSVLink
              data={payoutPriceList.map((record) => ({
                ...record,
                totalPayout: calculateTotalPayout(record.articles, record.payoutRate),
              }))}
              headers={columns.map((col) => ({ label: col.title, key: col.dataIndex }))}
              filename={`payout_report_${Date.now()}.csv`}
            >
              Download as CSV
            </CSVLink>
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button type="primary" block onClick={handleSubmit} loading={savingGoogleSheet}>
            Save in Google Sheet
          </Button>
        </Col>
      </Row>

      <div className="tableContainer">
        <Table
          columns={columns}
          dataSource={payoutPriceList.map((val) => ({
            ...val,
            totalPayout: val.articles * val.payoutRate,
          }))}
          pagination={false}
          rowClassName="editable-row"
          bordered
        />
      </div>
    </div>
  );
}
