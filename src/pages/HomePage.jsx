import { useEffect, useState, useRef } from 'react';
import { Collapse, Spin, Input, DatePicker } from 'antd';
import { debounce } from 'lodash';
import { useDataProvider } from '../context';
import '../styles/homePage.css';
import { NoDataComponent } from '../components';
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
        }&sortBy=publishedAt&apiKey=5c3bca78178242bc9e8281d88947cb95`
      );
      let data = await fetchItems.json();
      data = data.articles || [];
      data = [
        {
          source: {
            id: null,
            name: 'Biztoc.com',
          },
          author: 'msnbc.com',
          title: 'The right’s outrage about Tesla protests rings especially hollow',
          description:
            'Demonstrators protest at the "Tesla Takedown Dance Party" in front of the Tesla store in the Georgetown neighborhood of Washington, D.C., on March 22, 2025.',
          url: 'https://biztoc.com/x/d144e3043c3a7a7e',
          urlToImage: 'https://biztoc.com/cdn/d144e3043c3a7a7e_s.webp',
          publishedAt: '2025-03-29T12:13:03Z',
          content:
            'Demonstrators protest at the "Tesla Takedown Dance Party" in front of the Tesla store in the Georgetown neighborhood of Washington, D.C., on March 22, 2025.\r\nThis story appeared on msnbc.com, 2025-03… [+12 chars]',
        },
        {
          source: {
            id: null,
            name: 'Biztoc.com',
          },
          author: 'barchart.com',
          title: 'Tesla Stock: Why Are Wall Street Analysts So Intensely Divided?',
          description:
            'Your browser of choice has not been tested for use with Barchart.com. If you have issues, please download one of the browsers listed here.\nLess than $10/month! Get more Watchlists, Portfolios, Custom Views and Chart Templates with Barchart Plus.\nFREE 30 Day T…',
          url: 'https://biztoc.com/x/d45abd3e3467024f',
          urlToImage: 'https://biztoc.com/cdn/d45abd3e3467024f_s.webp',
          publishedAt: '2025-03-29T12:12:50Z',
          content:
            'Your browser of choice has not been tested for use with Barchart.com. If you have issues, please download one of the browsers listed here.Less than $10/month! Get more Watchlists, Portfolios, Custom … [+135 chars]',
        },
        {
          source: {
            id: null,
            name: 'Biztoc.com',
          },
          author: 'thestreet.com',
          title: 'Analyst reboots Tesla stock price target ahead of deliveries',
          description:
            "Pure chaos.\nNow, those are two words that don't sound appealing under any circumstances.\nYet that is the exact term that a team of Wedbush analysts led by Dan Ives used to describe President Donald Trump's plan to slap a 25% tariff on all imported cars starti…",
          url: 'https://biztoc.com/x/fb6b3fd1666c30b1',
          urlToImage: 'https://biztoc.com/cdn/fb6b3fd1666c30b1_s.webp',
          publishedAt: '2025-03-29T11:50:28Z',
          content:
            "Pure chaos.Now, those are two words that don't sound appealing under any circumstances.Yet that is the exact term that a team of Wedbush analysts led by Dan Ives used to describe President Donald Tru… [+142 chars]",
        },
        {
          source: {
            id: null,
            name: 'Forbes',
          },
          author:
            'Billy Bambrough, Senior Contributor, \n Billy Bambrough, Senior Contributor\n https://www.forbes.com/sites/billybambrough/',
          title: 'Bitcoin And Crypto Brace For A Huge $36 Trillion April Fed Price Flip',
          description:
            'Federal Reserve chair Jerome Powell could be about to trigger bitcoin price and crypto market mayhem...',
          url: 'https://www.forbes.com/sites/digital-assets/2025/03/29/bitcoin-and-crypto-braced-for-a-huge-36-trillion-april-fed-price-flip/',
          urlToImage:
            'https://imageio.forbes.com/specials-images/imageserve/66f58a10bd6ceded58613539/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
          publishedAt: '2025-03-29T11:45:34Z',
          content:
            'Bitcoin and crypto prices have dropped back as inflation fears and U.S. president Donald Trumps tariff threats continue to weigh on the bitcoin price (as well as fresh fears over a new, mystery hack)… [+3301 chars]',
        },
        {
          source: {
            id: null,
            name: 'Fark.com',
          },
          author: null,
          title:
            "Two thirds of Americans won't buy a Tesla, most citing Elon Musk's meddling. The other third can't afford one [Amusing]",
          description:
            "Two thirds of Americans won't buy a Tesla, most citing Elon Musk's meddling. The other third can't afford one",
          url: 'https://www.fark.com/comments/13615014/Two-thirds-of-Americans-wont-buy-a-Tesla-most-citing-Elon-Musks-meddling-The-other-third-cant-afford-one',
          urlToImage: 'https://img.fark.net/images/2013/site/farkLogo2Big.gif',
          publishedAt: '2025-03-29T11:35:51Z',
          content:
            'FTA  "Meanwhile, Tesla - the target of #TeslaTakedown protests at dealerships across the country - is now more popular with Republicans (27% of whom say they would consider buying or leasing one) tha… [+278 chars]',
        },
        {
          source: {
            id: null,
            name: 'Newser',
          },
          author: 'Jenn Gidman',
          title: 'Elon Musk Sells X, to Another Musk Company',
          description:
            "Elon Musk has sold social media site X to his own xAI artificial intelligence company in a $33 billion all-stock deal, the billionaire announced on Friday. Both companies are privately held, which means they aren't required to disclose their finances to the p…",
          url: 'https://www.newser.com/story/366403/elon-musk-sells-x-to-another-musk-company.html',
          urlToImage: 'https://img1-azrcdn.newser.com/image/1601472-12-20250329063002.jpeg',
          publishedAt: '2025-03-29T11:30:00Z',
          content:
            'Elon Musk has sold social media site X to his own xAI artificial intelligence company in a $33 billion all-stock deal, the billionaire announced on Friday. Both companies are privately held, which me… [+1153 chars]',
        },
      ];
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
