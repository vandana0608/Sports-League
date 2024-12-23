/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 * 
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM, 
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.  
 * 
 *       ADDITIONALLY, MAKE SURE THAT ALL LIBRARIES USED IN THIS FILE FILE ARE COMPATIBLE WITH PURE JAVASCRIPT
 * 
 */
class LeagueService {   

    constructor() {
        this.matches = [];
        this.API_BASE_URL = 'http://localhost:3001/api/v1';
    }

    /**
     * Sets the match schedule.
     * Match schedule will be given in the following form:
     * [
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      },
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      }    
     * ]
     * 
     * @param {Array} matches List of matches.
     */    
    setMatches(matches) {
        this.matches = matches;
    }

    /**
     * Returns the full list of matches.
     * 
     * @returns {Array} List of matches.
     */
    getMatches() {
        return this.matches;
    }

    /**
     * Returns the leaderboard in a form of a list of JSON objecs.
     * 
     * [     
     *      {
     *          teamName: [STRING]',
     *          matchesPlayed: [INTEGER],
     *          goalsFor: [INTEGER],
     *          goalsAgainst: [INTEGER],
     *          points: [INTEGER]     
     *      },      
     * ]       
     * 
     * @returns {Array} List of teams representing the leaderboard.
     */
    getLeaderboard() {
        const teams = new Map();

        // Initialize teams
        this.matches.forEach(match => {
            [match.homeTeam, match.awayTeam].forEach(teamName => {
                if (!teams.has(teamName)) {
                    teams.set(teamName, {
                        teamName,
                        matchesPlayed: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        goalDifference: 0,
                        points: 0,
                        headToHead: new Map()
                    });
                }
            });
        });

        // Calculate statistics
        this.matches.forEach(match => {
            if (!match.matchPlayed) return;

            const homeTeam = teams.get(match.homeTeam);
            const awayTeam = teams.get(match.awayTeam);

            // Update matches played
            homeTeam.matchesPlayed++;
            awayTeam.matchesPlayed++;

            // Update goals
            homeTeam.goalsFor += match.homeTeamScore;
            homeTeam.goalsAgainst += match.awayTeamScore;
            awayTeam.goalsFor += match.awayTeamScore;
            awayTeam.goalsAgainst += match.homeTeamScore;

            // Update goal difference
            homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
            awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;

            // Update points and head-to-head
            if (match.homeTeamScore > match.awayTeamScore) {
                homeTeam.points += 3;
                this.updateHeadToHead(homeTeam, awayTeam, 3, 0);
            } else if (match.homeTeamScore < match.awayTeamScore) {
                awayTeam.points += 3;
                this.updateHeadToHead(homeTeam, awayTeam, 0, 3);
            } else {
                homeTeam.points += 1;
                awayTeam.points += 1;
                this.updateHeadToHead(homeTeam, awayTeam, 1, 1);
            }
        });

        return this.sortTeams(Array.from(teams.values()));

    }
    
    /**
     * Asynchronic function to fetch the data from the server and set the matches.
     */
    async fetchData() {
        try {
            // Get access token
            const tokenResponse = await fetch(`${this.API_BASE_URL}/getAccessToken`);
            const tokenData = await tokenResponse.json();
            
            if (!tokenData.success) {
                throw new Error('Failed to get access token');
            }

            // Get matches with token
            const matchesResponse = await fetch(`${this.API_BASE_URL}/getAllMatches`, {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`
                }
            });
            const matchesData = await matchesResponse.json();

            if (!matchesData.success) {
                throw new Error('Failed to fetch matches');
            }

            this.setMatches(matchesData.matches);
            return matchesData.matches;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
    
    updateHeadToHead(homeTeam, awayTeam, homePoints, awayPoints) {
        if (!homeTeam.headToHead.has(awayTeam.teamName)) {
            homeTeam.headToHead.set(awayTeam.teamName, 0);
        }
        if (!awayTeam.headToHead.has(homeTeam.teamName)) {
            awayTeam.headToHead.set(homeTeam.teamName, 0);
        }

        homeTeam.headToHead.set(
            awayTeam.teamName,
            homeTeam.headToHead.get(awayTeam.teamName) + homePoints
        );
        awayTeam.headToHead.set(
            homeTeam.teamName,
            awayTeam.headToHead.get(homeTeam.teamName) + awayPoints
        );
    }
    
    sortTeams(teams) {
        return teams.sort((a, b) => {
            // Primary sort by points
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            // Head-to-head comparison for teams with same points
            const samePointsTeams = teams.filter(team => team.points === a.points);
            if (samePointsTeams.length === 2) {
                const h2hPoints = a.headToHead.get(b.teamName) || 0;
                const h2hPointsB = b.headToHead.get(a.teamName) || 0;
                if (h2hPoints !== h2hPointsB) {
                    return h2hPointsB - h2hPoints;
                }
            }

            // Goal difference
            if (b.goalDifference !== a.goalDifference) {
                return b.goalDifference - a.goalDifference;
            }

            // Goals scored
            if (b.goalsFor !== a.goalsFor) {
                return b.goalsFor - a.goalsFor;
            }

            // Alphabetical order
            return a.teamName.localeCompare(b.teamName);
        });
    }
}

export default LeagueService;