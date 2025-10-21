# IPT2-Monitoring-System

A comprehensive Student and Faculty Monitoring System built with Laravel and React.

## Features

- **Student Management**: Add, edit, view, and archive student records
- **Faculty Management**: Manage faculty information and assignments
- **Course Management**: Handle course creation and enrollment
- **Department Management**: Organize courses by departments
- **Reports & Analytics**: Generate comprehensive reports and statistics
- **User Authentication**: Secure login system
- **React Frontend**: Modern, responsive user interface
- **Database Integration**: MySQL database with proper relationships

## Technology Stack

- **Backend**: Laravel 8.x
- **Frontend**: React with Bootstrap
- **Database**: MySQL
- **Authentication**: Laravel's built-in authentication system

## Installation

1. Clone the repository:
```bash
git clone https://github.com/veah-jp/IPT2-Monitoring-System.git
cd IPT2-Monitoring-System
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Set up environment configuration:
```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database settings in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=monitor_system2
DB_USERNAME=root
DB_PASSWORD=
```

6. Run database migrations:
```bash
php artisan migrate
```

7. Seed the database (optional):
```bash
php artisan db:seed
```

8. Compile frontend assets:
```bash
npm run dev
```

9. Start the development server:
```bash
php artisan serve
```

## Usage

1. Access the application at `http://localhost:8000`
2. Login with your credentials
3. Navigate through the different sections:
   - Dashboard: Overview of students, faculty, and courses
   - Students: Manage student records
   - Faculty: Manage faculty information
   - Reports: View analytics and statistics
   - Settings: System configuration

## Database Schema

The system includes the following main tables:
- `users`: User authentication
- `students`: Student information
- `faculty`: Faculty information
- `courses`: Course details
- `departments`: Department information
- `enrollments`: Student-course relationships

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
