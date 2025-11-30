# Database Schema - Kafe Bilyar App

## Tables Overview

1. **users** - Customer accounts
2. **admins** - Admin/Super Admin accounts
3. **tables** - Billiard tables
4. **bookings** - Table reservations
5. **menu_items** - Food & drinks
6. **orders** - Customer orders
7. **transactions** - Payment records
8. **attendance** - Admin attendance logs

---

## Detailed Schema

### 1. users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | UNIQUE |
| avatar_url | TEXT | NULL |
| total_bookings | INTEGER | DEFAULT 0 |
| total_hours_played | INTEGER | DEFAULT 0 |
| rating | DECIMAL(2,1) | DEFAULT 0.0 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 2. admins
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| role | ENUM('admin', 'super_admin') | NOT NULL |
| face_data | JSONB | NULL (untuk face recognition) |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 3. tables
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| name | VARCHAR(50) | UNIQUE, NOT NULL |
| capacity | INTEGER | NOT NULL |
| status | ENUM('available', 'occupied', 'maintenance') | DEFAULT 'available' |
| price_per_hour | INTEGER | NOT NULL |
| features | JSONB | NULL (array of features) |
| image_type | VARCHAR(20) | DEFAULT 'standard' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 4. bookings
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE |
| table_id | UUID | FOREIGN KEY → tables(id) ON DELETE CASCADE |
| start_time | TIMESTAMP | NOT NULL |
| end_time | TIMESTAMP | NOT NULL |
| duration_hours | INTEGER | NOT NULL |
| total_price | INTEGER | NOT NULL |
| status | ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') | DEFAULT 'pending' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 5. menu_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| name | VARCHAR(100) | NOT NULL |
| category | ENUM('food', 'drink', 'snack') | NOT NULL |
| price | INTEGER | NOT NULL |
| description | TEXT | NULL |
| image_url | TEXT | NULL |
| is_available | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 6. orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| booking_id | UUID | FOREIGN KEY → bookings(id) ON DELETE CASCADE |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE |
| items | JSONB | NOT NULL (array of {menu_item_id, quantity, price}) |
| total_amount | INTEGER | NOT NULL |
| status | ENUM('pending', 'confirmed', 'preparing', 'served', 'completed') | DEFAULT 'pending' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 7. transactions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| booking_id | UUID | FOREIGN KEY → bookings(id) ON DELETE CASCADE |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE |
| amount | INTEGER | NOT NULL |
| payment_method | ENUM('cash', 'card', 'ewallet', 'transfer') | NOT NULL |
| status | ENUM('pending', 'completed', 'failed', 'refunded') | DEFAULT 'pending' |
| payment_proof_url | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### 8. attendance
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| admin_id | UUID | FOREIGN KEY → admins(id) ON DELETE CASCADE |
| clock_in | TIMESTAMP | NOT NULL |
| clock_out | TIMESTAMP | NULL |
| face_verified | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## Indexes (untuk performance)


---

## Row Level Security (RLS) Policies

**Enable RLS on all tables di Supabase!**

Example policy for `users`:
undefined