import { useEffect, useState, useRef } from 'react';
import { Collapse, Spin, Input, DatePicker } from 'antd';
import { debounce } from 'lodash';
import { useDataProvider } from '../context';
import '../styles/homePage.css';
import { NoDataComponent } from '../components';
import newsData from "../utils/newsData.json"
export function HomePage() {
  const {
    newsItemsList,
    addNewsItem,
    newsItemValueFilter,
    changeNewsItemFilter,
    filters,
    updateFilter,
  } = useDataProvider();
  const [loading, setLoading] = useState(true);

  const fetchNewsItems = async () => {
    setLoading(true);
    try {
      const fetchItems = await fetch(
        `https://newsapi.org/v2/everything?q=${
          newsItemValueFilter ? newsItemValueFilter : 'sports'
        }&sortBy=publishedAt&apiKey=bf75de50a6ac411ea49750cc26a83c15`
      );
      let data = await fetchItems.json();
      //IF THE API KEY ACCESS IS OVER 
      data = data.articles || newsData.articles;
      let result = data.map((item) => ({ ...item, label: item.title }));
      result = result.filter((item) => item.publishedAt && item.author);
      applyFilters(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      addNewsItem([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchNewsItem = debounce(fetchNewsItems, 500);
  useEffect(() => {
    debouncedFetchNewsItem();
  }, [newsItemValueFilter]);

  const applyFilters = (filterToApplyArr) => {
    const arr = filterToApplyArr ? filterToApplyArr : newsItemsList;
    const filteredArr = arr.filter((item) => {
      const { author, dateRange } = filters;

      const matchesAuthor = author
        ? item.author.toLowerCase().includes(author.toLowerCase())
        : true;

      const itemDate = new Date(item.publishedAt);
      const [startDate, endDate] = dateRange;
      const matchesDate =
        startDate && endDate
          ? itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
          : true;

      return matchesAuthor && matchesDate;
    });

    addNewsItem(filteredArr);
  };

  const handleFilterChange = (key, value) => {
    const updatedObj = { ...filters, [key]: value };
    updateFilter(updatedObj);
  };

  useEffect(() => {
    // CALLING API ON CHANGING FILTER, AS FILTERS CAN BE PASSED VIA PARAMS GENERALLY
    debouncedFetchNewsItem();
  }, [filters]);

  return (
    <>
      <div className="filters">
        <Input
          className="newsItemFilter"
          placeholder="Search News Item "
          onChange={(e) => changeNewsItemFilter(e.target.value)}
          value={newsItemValueFilter}
        />

        <div className="extraFilters">
          <Input
            className="authorNameFilter"
            placeholder="Search By Author"
            onChange={(e) => handleFilterChange('author', e.target.value)}
            value={filters.author}
          />
          <DatePicker.RangePicker
            className="dateFilter"
            format="YYYY-MM-DD"
            style={{ marginLeft: '10px' }}
            onChange={(dates) => handleFilterChange('dateRange', dates ?? [])}
            value={filters.dateRange}
          />
        </div>
      </div>

      <div
        style={{
          height: '100%',
          overflowY: 'scroll',
          position: 'relative',
          backgroundColor: 'var(--primary-background)', // Apply primary background color
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Collapse accordion>
          {newsItemsList.map((item, index) => (
            <Collapse.Panel
              key={index}
              header={
                <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px' }}>
                  <h2 style={{ margin: '0', color: '#1E90FF' }}>${item.title}</h2>{' '}
                  <p style={{ margin: '5px 0', color: '#555' }}>Author: {item.author}</p>{' '}
                  <p style={{ margin: '5px 0', color: '#555' }}>
                    Published At: {new Date(item.publishedAt).toDateString()}
                  </p>
                </div>
              }
            >
              <p style={{ padding: '10px', color: 'rgb(8 58 105)', fontStyle: 'italic' }}>
                {item.description}
              </p>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Read In Detail...
              </a>
            </Collapse.Panel>
          ))}
        </Collapse>

        {loading && (
          <div
            style={{
              position: 'fixed',
              bottom: '10px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50% , -50%)',
              zIndex: 10,
              backgroundColor: '#fff', // Background for the spinner to stand out
              borderRadius: '50%',
              padding: '10px',
              height: 'fit-content',
              width: 'fit-content',
            }}
          >
            <Spin tip="Loading..." size="large" />
          </div>
        )}
        {!loading && newsItemsList.length === 0 && <NoDataComponent />}
      </div>
    </>
  );
}
