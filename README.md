# Sports Leagues - League List Application

A React application that displays sports leagues from around the world with filtering and search capabilities.

## Overview

This application was developed as a home assignment for a Frontend Engineer position at Sporty Group. It demonstrates proficiency in React development, API integration, state management, and component-based architecture.

## Features

- **League Display**: Fetches and displays sports leagues from TheSportsDB API
- **Search Functionality**: Filter leagues by name or sport type
- **Sport Filtering**: Dropdown to filter leagues by specific sports
- **Badge Display**: Click on any league to view its season badge/logo
- **Responsive Design**: Works on desktop and mobile devices
- **Caching**: API responses are cached to avoid repeat calls
- **Loading States**: Proper loading indicators for better UX
- **Error Handling**: Graceful error handling for API failures

## Technical Stack

- **React**: Frontend framework
- **JavaScript (JSX)**: Programming language
- **Tailwind CSS**: Styling framework
- **shadcn/ui**: UI component library
- **Lucide React**: Icon library
- **Vite**: Build tool and development server

## API Integration

The application consumes two APIs from TheSportsDB:

1. **All Leagues API**: `https://www.thesportsdb.com/api/v1/json/3/all_leagues.php`
   - Fetches all available sports leagues
   - Displays: League name, sport type, alternate names, league ID

2. **Season Badge API**: `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id={leagueId}`
   - Fetches season badge/logo for a specific league
   - Displays league badges in a modal popup

## Key Components

- **Main App Component**: Handles state management and API calls
- **League Cards**: Display individual league information
- **Search Bar**: Real-time search functionality
- **Sport Filter Dropdown**: Filter by sport type
- **Badge Modal**: Display league badges/logos
- **Loading States**: Spinner animations during API calls
- **Error States**: User-friendly error messages

## Performance Optimizations

- **API Response Caching**: Prevents redundant API calls
- **Efficient Filtering**: Client-side filtering for better performance
- **Lazy Loading**: Badge images loaded on demand
- **Responsive Grid**: Optimized layout for different screen sizes

## Design Features

- **Modern UI**: Clean, professional design with gradients and shadows
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive Layout**: Grid system adapts to screen size
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Visual Hierarchy**: Clear typography and spacing

## Installation and Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Open browser to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── ui/          # shadcn/ui components
├── assets/          # Static assets
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## License

This project was created as a home assignment and is for demonstration purposes only.
