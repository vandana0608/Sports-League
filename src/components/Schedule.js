import { useEffect, useState } from 'react';
import LeagueService from '../services/LeagueService';
import '../styles/Schedule.css';

function Schedule() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const leagueService = new LeagueService();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await leagueService.fetchData();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return (
      <div className="date-cell">
        <div>{`${day}.${month}.${year}`}</div>
        <div>{`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`}</div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="schedule-page">
      <h1>League Schedule</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="date-header"><b>Date/Time</b></th>
              <th className="stadium-header"><b>Stadim</b></th>
              <th className="home-team-header"><b>Home Team</b></th>
              <th className="score-header"></th>
              <th className="away-team-header"><b>Away Team</b></th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className={index % 2 === 0 ? '' : 'even'}>
                <td>{formatDate(match.matchDate)}</td>
                <td className="stadium">{match.stadium}</td>
                <td className="team-cell home-team">
                  <span className="team-name bold">{match.homeTeam}</span>
                  <img 
                    src={`https://flagsapi.codeaid.io/${match.homeTeam}.png`} 
                    alt={match.homeTeam} 
                    className="flag"
                  />
                </td>
                <td className="score">
                  {match.matchPlayed ? `${match.homeTeamScore} : ${match.awayTeamScore}` : '- : -'}
                </td>
                <td className="team-cell away-team">
                  <img 
                    src={`https://flagsapi.codeaid.io/${match.awayTeam}.png`} 
                    alt={match.awayTeam} 
                    className="flag"
                  />
                  <span className="team-name bold">{match.awayTeam}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedule;