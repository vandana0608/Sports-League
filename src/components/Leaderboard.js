import { useEffect, useState } from 'react';
import LeagueService from '../services/LeagueService';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const leagueService = new LeagueService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await leagueService.fetchData();
        const leaderboardData = leagueService.getLeaderboard();
        setStandings(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="leaderboard-page">
      <h1>League Standings</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><b>Team Name</b></th>
              <th><b>MP</b></th>
              <th><b>GF</b></th>
              <th><b>GA</b></th>
              <th><b>Points</b></th>
            </tr>
          </thead>
          <tbody>
          {standings.map((team) => (
            <tr key={team.teamName}>
            <td className="team-cell">
                <img 
                src={`https://flagsapi.codeaid.io/${team.teamName}.png`} 
                alt={team.teamName} 
                className="flag"
                />
                <span className="team-name">{team.teamName}</span>
            </td>
            <td className="numeric">{team.matchesPlayed}</td>
            <td className="numeric">{team.goalsFor}</td>
            <td className="numeric">{team.goalsAgainst}</td>
            <td className="points numeric">{team.points}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;