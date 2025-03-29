import React, { useEffect, useState } from 'react';
import { Table, Input, InputNumber, Button } from 'antd';
import { useDataProvider } from '../context';
import '../styles/payoutCalculations.css';

export function PayoutCalculations() {
  const { newsItemsList, addNewsItem } = useDataProvider();
  const [payoutPriceList, setPayoutPriceList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const calculateTotalPayout = (articles, payoutRate) => {
    return articles * payoutRate;
  };

  const handlePayoutRateChange = (value, authorName) => {
    const updatedPayoutPriceList = payoutPriceList.map((author) =>
      author.name === authorName ? { ...author, payoutRate: value } : author
    );
    setPayoutPriceList(updatedPayoutPriceList);
    localStorage.setItem('payoutDetailsArr', JSON.stringify(updatedPayoutPriceList || []));
  };

  const columns = [
    {
      title: 'Author',
      dataIndex: 'name',
      key: 'name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Author"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon="🔍"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Articles',
      dataIndex: 'articles',
      key: 'articles',
    },
    {
      title: 'Payout Rate in $',
      dataIndex: 'payoutRate',
      key: 'payoutRate',
      render: (text, record) => (
        <InputNumber
          type="number"
          min={0}
          value={text}
          onChange={(value) => handlePayoutRateChange(value, record.name)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Total Payout in $',
      dataIndex: 'totalPayout',
      key: 'totalPayout',
      render: (_, record) => calculateTotalPayout(record.articles, record.payoutRate),
    },
  ];

  useEffect(() => {
    const payoutDetailsArr = JSON.parse(localStorage.getItem('payoutDetailsArr')) || [];
    const accumulatedList = newsItemsList.reduce((acc, val) => {
      const authorName = `${val.author ?? ''}`;
      if (!authorName) return acc;
      if (acc[authorName]) {
        acc[authorName].articles += 1;
      } else {
        acc[authorName] = { articles: 1, payoutRate: 0 };
      }
      return acc;
    }, {});

    let payoutPriceArr = Object.keys(accumulatedList).map((val) => {
      return { name: val, ...accumulatedList[val] };
    });

    payoutPriceArr = payoutPriceArr.map((val) => {
      const ind = payoutDetailsArr.findIndex((ele) => ele.name === val.name);
      if (ind !== -1) {
        val.payoutRate = payoutDetailsArr[ind].payoutRate;
      }
      return { ...val };
    });

    setPayoutPriceList(payoutPriceArr);
    setFilteredData(payoutPriceArr);
    localStorage.setItem('payoutDetailsArr', JSON.stringify(payoutPriceArr));
  }, []);

  return (
    <div className="payoutDiv">
      <p className="payoutDetails">Payout Calculation</p>
      <div className="tableContainer">
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : payoutPriceList}
          pagination={false}
          rowClassName="editable-row"
          bordered
          scroll={{ x: 800 }} // For horizontal scroll on small screens
        />
      </div>
    </div>
  );
}
