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
    file: string;
    title: string;
  }

  export interface Genre {
    id: number;
    title: string;
    description: string;
    showIds: number[];
  }