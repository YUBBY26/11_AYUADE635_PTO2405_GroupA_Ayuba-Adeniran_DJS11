export interface Preview {
    id: number;
    title: string;
    description: string;
    seasons: number;
    image: string;
    genreIds: number[];
    updated: string;
  }

  export interface Show {
    id: number;
    title: string;
    description: string;
    seasons: Season[];
  }

  export interface Season {
    id: number;
    title: string;
    image: string;
    episodes: Episode[];
  }

  export interface Episode {
    id: number;
    title: string;
    file: string;
    description?: string;
    duration?: number;
  }
  

  export interface Genre {
    id: number;
    title: string;
    description: string;
    showIds: number[];
  }
  export interface FavouriteEpisode {
    episode: Episode;
    seasonTitle: string;
    showTitle: string;
    addedAt: string;
  }