import { useEffect } from 'react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = ({ stats }) => {
  useEffect(() => {
    // Initialisation du graphique
    console.log('Chart initialized');
  }, []);

  const fraudChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Fraudes détectées',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
        borderColor: 'rgb(244, 67, 54)',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Transactions totales (x100)',
        data: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        borderColor: 'rgb(33, 150, 243)',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  const statsCards = [
    {
      id: 'transactions',
      title: 'Transactions analysées',
      icon: <FiShield />,
      value: stats.totalTransactions.toLocaleString(),
      change: '+12%',
      isPositive: true,
      color: 'blue'
    },
    {
      id: 'frauds',
      title: 'Fraudes détectées',
      icon: <FiAlertTriangle />,
      value: stats.fraudDetected,
      change: '-5%',
      isPositive: false,
      color: 'red'
    },
    {
      id: 'accuracy',
      title: 'Taux de précision',
      icon: <FiCheckCircle />,
      value: `${stats.accuracyRate}%`,
      change: '+2.3%',
      isPositive: true,
      color: 'green'
    },
    {
      id: 'time',
      title: 'Temps moyen',
      icon: <FiClock />,
      value: `${stats.avgTime}ms`,
      change: '-15%',
      isPositive: true,
      color: 'purple'
    }
  ];

  return (
    <section id="statistiques" className="statistiques-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Statistiques</h2>
          <p className="section-subtitle">Vue d'ensemble des analyses effectuées</p>
        </div>

        <div className="stats-grid">
          {statsCards.map((stat) => (
            <div key={stat.id} className="stats-card">
              <div className="stats-card-header">
                <h3>{stat.title}</h3>
                <div className={`stats-icon ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="stats-card-value">{stat.value}</div>
              <div className={`stats-card-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{stat.change}</span> ce mois
              </div>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <div className="chart-card">
            <h3>Évolution des fraudes détectées</h3>
            <div style={{ height: '400px' }}>
              <Line data={fraudChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;