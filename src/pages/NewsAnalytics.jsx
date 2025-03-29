import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useDataProvider } from '../context';
import { aggregateByAuthor, aggregateBySource } from '../utils';
import { PieChart } from '../components';
import { NoDataComponent } from '../components';
import '../styles/newsAnalytics.css';
ChartJS.register(ArcElement, Tooltip, Legend);

export function NewsAnalytics() {
  const { newsItemsList } = useDataProvider();
  const authorData = aggregateByAuthor(newsItemsList ?? [], 'author');
  const sourceData = aggregateBySource(newsItemsList ?? [], 'name');

  return (
    <div className="outerTrendingContainer">
      <div className="trendingTopic">
        <p className="topicName">Trending Authors</p>
        {Object.keys(authorData).length === 0 ? (
          <NoDataComponent />
        ) : (
          <PieChart pieChartData={authorData} />
        )}
      </div>
      <div className="trendingTopic">
        <p className="topicName">Trending Sources</p>
        {Object.keys(authorData).length === 0 ? (
          <NoDataComponent />
        ) : (
          <PieChart pieChartData={sourceData} />
        )}
      </div>
    </div>
  );
}
