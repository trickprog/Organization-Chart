# HR Organization Chart - Clean

A modern, interactive HR organization chart application built with React and Vite. This application provides a clean and professional interface for visualizing company organizational structures with employee search and filtering capabilities.

## Features

- **Interactive Organization Chart**: Visualize your company's hierarchical structure in an intuitive tree layout
- **Employee Search**: Quick search functionality to find employees by name, title, or department
- **Employee Details**: Click on any employee card to view detailed information including:
  - Contact information (email, phone)
  - Location and department
  - Skills and competencies
  - Join date
- **Responsive Design**: Clean, professional UI built with Tailwind CSS
- **Search Highlighting**: Visual highlighting of search results in the organization chart
- **Modal Details View**: Detailed employee information in an elegant modal interface

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.3
- **Icons**: Lucide React 0.263.1
- **Organization Chart**: React Organizational Chart 2.2.1
- **Font**: Inter (Google Fonts)

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── EmployeeCard.jsx
│   │   ├── ProfessionalOrgChart.jsx
│   │   └── SearchFilter.jsx
│   ├── data/           # Mock data
│   │   └── mockData.js
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hr-org-chart-clean
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Configuration

### Vite Configuration

The project includes optimized build configuration with:
- Code splitting for vendor libraries (React, React-DOM)
- Separate chunk for icon libraries (Lucide React)
- Source maps enabled for debugging
- Custom server port (5173)

### Customizing Employee Data

Employee data is stored in `src/data/mockData.js`. Each employee object includes:
- `id`: Unique identifier
- `name`: Employee full name
- `title`: Job title
- `department`: Department name
- `email`: Email address
- `phone`: Phone number
- `location`: Office location
- `managerId`: ID of direct manager (null for CEO)
- `avatar`: Profile image URL
- `joinDate`: Employment start date
- `skills`: Array of skills/competencies

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory with:
- Minified JavaScript and CSS
- Code splitting for optimal loading
- Source maps for debugging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Organization chart component from [React Organizational Chart](https://github.com/daniel-hauser/react-organizational-chart)

## Support

For issues, questions, or contributions, please open an issue in the repository.
