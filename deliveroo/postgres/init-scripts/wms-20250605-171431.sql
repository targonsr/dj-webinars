DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS warehouse CASCADE;
DROP TABLE IF EXISTS zone CASCADE;
DROP TABLE IF EXISTS aisle CASCADE;
DROP TABLE IF EXISTS rack CASCADE;
DROP TABLE IF EXISTS shelf CASCADE;
DROP TABLE IF EXISTS capacity CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS employee_role CASCADE;
DROP TABLE IF EXISTS storage_request CASCADE;
DROP TABLE IF EXISTS storage_reservation CASCADE;
DROP TABLE IF EXISTS storage_record CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS storage_event_type CASCADE;
DROP TABLE IF EXISTS storage_event_history CASCADE;
DROP TABLE IF EXISTS employee_warehouse CASCADE;

-- LOCATIONS
CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL
);

-- WAREHOUSES
CREATE TABLE warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES location(location_id),
    name TEXT NOT NULL
);

CREATE INDEX idx_warehouse_location_id ON warehouse(location_id);

-- ZONES
CREATE TABLE zone (
    zone_id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE INDEX idx_zone_warehouse_id ON zone(warehouse_id);

-- AISLES
CREATE TABLE aisle (
    aisle_id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zone(zone_id),
    label TEXT NOT NULL,
    width INTEGER NOT NULL,
    width_unit TEXT NOT NULL
);

CREATE INDEX idx_aisle_zone_id ON aisle(zone_id);

-- RACKS
CREATE TABLE rack (
    rack_id SERIAL PRIMARY KEY,
    aisle_id INTEGER NOT NULL REFERENCES aisle(aisle_id),
    label TEXT NOT NULL,
    max_height INTEGER NOT NULL,
    height_unit TEXT NOT NULL
);

CREATE INDEX idx_rack_aisle_id ON rack(aisle_id);

-- SHELVES
CREATE TABLE shelf (
    shelf_id SERIAL PRIMARY KEY,
    rack_id INTEGER NOT NULL REFERENCES rack(rack_id),
    level TEXT NOT NULL,
    max_weight NUMERIC NOT NULL,
    max_volume NUMERIC NOT NULL
);

CREATE INDEX idx_shelf_rack_id ON shelf(rack_id);

-- CAPACITY (Polymorphic association)
CREATE TABLE capacity (
    capacity_id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('WAREHOUSE','ZONE','RACK','SHELF')),
    entity_id INTEGER NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    description TEXT
);

CREATE INDEX idx_capacity_entity ON capacity(entity_type, entity_id);

-- CUSTOMERS
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
);

-- EMPLOYEES
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    hire_date DATE NOT NULL
);

-- ROLES
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- EMPLOYEE ROLES
CREATE TABLE employee_role (
    employee_id INTEGER NOT NULL REFERENCES employee(employee_id),
    role_id INTEGER NOT NULL REFERENCES role(role_id),
    assigned_date DATE NOT NULL,
    PRIMARY KEY (employee_id, role_id)
);

-- EMPLOYEE-WAREHOUSE RELATION (many-to-many)
CREATE TABLE employee_warehouse (
    employee_id INTEGER NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    assigned_from DATE NOT NULL,
    assigned_until DATE,
    PRIMARY KEY (employee_id, warehouse_id, assigned_from)
);

CREATE INDEX idx_employee_warehouse_employee ON employee_warehouse(employee_id);
CREATE INDEX idx_employee_warehouse_warehouse ON employee_warehouse(warehouse_id);

ALTER TABLE employee_warehouse ADD CONSTRAINT chk_assigned_dates CHECK (assigned_until IS NULL OR assigned_from < assigned_until);

-- STORAGE REQUESTS
CREATE TABLE storage_request (
    request_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(warehouse_id),
    requested_entry_date TIMESTAMP NOT NULL,
    requested_exit_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','accepted','rejected')),
    decision_employee_id INTEGER REFERENCES employee(employee_id),
    decision_date TIMESTAMP
);

CREATE INDEX idx_storage_request_customer_id ON storage_request(customer_id);
CREATE INDEX idx_storage_request_warehouse_id ON storage_request(warehouse_id);

-- STORAGE RESERVATIONS
CREATE TABLE storage_reservation (
    reservation_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    reserved_weight NUMERIC NOT NULL,
    reserved_volume NUMERIC NOT NULL,
    reserved_from TIMESTAMP NOT NULL,
    reserved_until TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','active','expired','cancelled'))
);

CREATE INDEX idx_storage_reservation_request_id ON storage_reservation(request_id);
CREATE INDEX idx_storage_reservation_customer_id ON storage_reservation(customer_id);
CREATE INDEX idx_storage_reservation_shelf_id ON storage_reservation(shelf_id);

-- STORAGE RECORDS
CREATE TABLE storage_record (
    storage_record_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES storage_request(request_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    shelf_id INTEGER NOT NULL REFERENCES shelf(shelf_id),
    actual_entry_date TIMESTAMP NOT NULL,
    actual_exit_date TIMESTAMP,
    cargo_description TEXT NOT NULL,
    cargo_weight NUMERIC NOT NULL,
    cargo_volume NUMERIC NOT NULL
);

CREATE INDEX idx_storage_record_customer_id ON storage_record(customer_id);
CREATE INDEX idx_storage_record_shelf_id ON storage_record(shelf_id);

-- PAYMENTS
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending','paid','failed','cancelled')),
    payment_date TIMESTAMP,
    external_reference TEXT
);

CREATE INDEX idx_payment_customer_id ON payment(customer_id);
CREATE INDEX idx_payment_storage_record_id ON payment(storage_record_id);

-- STORAGE EVENT TYPES
CREATE TABLE storage_event_type (
    event_type_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE UNIQUE INDEX idx_storage_event_type_name ON storage_event_type(name);

-- STORAGE EVENT HISTORY
CREATE TABLE storage_event_history (
    event_id SERIAL PRIMARY KEY,
    storage_record_id INTEGER NOT NULL REFERENCES storage_record(storage_record_id),
    event_type_id INTEGER NOT NULL REFERENCES storage_event_type(event_type_id),
    event_time TIMESTAMP NOT NULL,
    employee_id INTEGER REFERENCES employee(employee_id),
    details JSONB
);

CREATE INDEX idx_storage_event_history_storage_record_id ON storage_event_history(storage_record_id);
CREATE INDEX idx_storage_event_history_event_type_id ON storage_event_history(event_type_id);

-- Locations
INSERT INTO location (location_id, address, city, postal_code, country) VALUES (1, 'ul. Wichrowa 89', 'Janki', '05-090', 'Poland');

-- Warehouses
INSERT INTO warehouse (warehouse_id, location_id, name) VALUES (1, 1, 'Main Deliveroo Warehouse');

-- Customers
INSERT INTO customer (customer_id, name, email, phone) VALUES
(1, 'Black-Rogers', 'kphillips@lowery.org', '346.523.4154'),
(2, 'Evans Group', 'adriana64@bush.info', '(311)655-9431x8803'),
(3, 'Wells LLC', 'carol40@khan-duke.com', '+1-804-632-3407x209'),
(4, 'James, Sanchez and Mata', 'zbennett@williamson-patton.com', '212.339.4666'),
(5, 'Graves-Jenkins', 'rcastillo@ware-jones.com', '691.972.9700'),
(6, 'Little-Lutz', 'cthompson@jones.com', '001-806-831-7533x51767'),
(7, 'Massey-Mcdonald', 'potterveronica@frye.com', '001-790-908-5469'),
(8, 'Allen Group', 'stricklandrachel@ramos.com', '648-377-1962x17949'),
(9, 'Rodriguez-Doyle', 'darrenmartinez@moreno.org', '955.562.7143x554'),
(10, 'Robinson LLC', 'elizabethbennett@daniel.biz', '001-752-297-4517x49580'),
(11, 'Hoffman Group', 'tmiller@cruz.com', '580-750-5624'),
(12, 'Whitehead, Richardson and Wilkinson', 'mkirk@conner-johnson.com', '391-969-2205'),
(13, 'White, Lowery and Pham', 'johnny38@edwards.com', '5014560702'),
(14, 'Jones LLC', 'allen27@solis.com', '5245880297'),
(15, 'Jones-Wu', 'james86@massey.com', '276.378.2664x3636'),
(16, 'Prince, Allen and Peters', 'iward@blake.net', '825-725-9741x2833'),
(17, 'Adams-Mcintosh', 'ypayne@fischer-fernandez.org', '824-473-0449x2340'),
(18, 'Kelley Ltd', 'christopher35@smith.com', '748.676.9377x3770'),
(19, 'Parker, Hensley and Newton', 'andrewagner@cunningham.biz', '+1-604-717-4758x266'),
(20, 'Murphy, Wood and Stewart', 'cynthiamanning@rogers.info', '001-663-231-3573x74513'),
(21, 'Jones and Sons', 'padillabrandon@patel.com', '001-755-318-1177x285'),
(22, 'Watson, Harrington and Vance', 'michelejohnson@barber.info', '8949934098'),
(23, 'Solomon PLC', 'deanna04@vazquez.com', '321.740.9001x39591'),
(24, 'Fields-Horn', 'cartercheryl@martin-bishop.biz', '+1-871-874-2068x053'),
(25, 'Oconnor-Dominguez', 'matthew59@lozano-atkinson.com', '+1-723-999-7363x996'),
(26, 'Braun-Rivera', 'kendramitchell@wilson.biz', '4036300377'),
(27, 'Pierce, Taylor and Haas', 'tammy85@alexander-fox.com', '+1-642-750-2140x5819'),
(28, 'Townsend, Harris and Kennedy', 'hunterdonald@johnson.biz', '+1-455-628-5311'),
(29, 'Williams, Gomez and Martin', 'pamelaadams@willis.com', '7989426658'),
(30, 'Hardin Ltd', 'dixondanielle@tucker.com', '+1-462-950-5536x613'),
(31, 'Walsh, Maldonado and Hughes', 'brianna38@robinson-wood.info', '6466259333'),
(32, 'Mason and Sons', 'danielle98@johnson-mitchell.com', '(531)623-6503x970'),
(33, 'Rubio-Kelley', 'zcooper@johnson.org', '827.493.6637x39025'),
(34, 'Sheppard-Miller', 'zhickman@alvarez.org', '(992)274-4559x6624'),
(35, 'Mahoney Group', 'danny84@jordan.net', '001-374-949-9919'),
(36, 'Griffith-Patterson', 'bairdnathan@holmes.com', '967-620-9742x4827'),
(37, 'Lowe Group', 'evansjoseph@garcia.info', '(833)901-4237'),
(38, 'Smith PLC', 'jonathan44@green-conrad.org', '292-608-9909'),
(39, 'Knight, Hayes and Hayden', 'zreeves@porter.com', '001-972-521-1625x215'),
(40, 'Campbell and Sons', 'michaelgutierrez@ewing.com', '+1-423-816-0859x1296'),
(41, 'Rodriguez-Austin', 'jason65@alexander.net', '+1-475-840-6354x935'),
(42, 'Roman-Snyder', 'aanderson@garrett-jordan.com', '001-234-791-5212x82005'),
(43, 'Romero-Evans', 'iortiz@jacobs.org', '001-386-763-3710x92589'),
(44, 'Mcfarland, Barker and Owen', 'michaelgordon@long.com', '766.397.4937x0361'),
(45, 'Hernandez, Bishop and Reynolds', 'danielalexander@johnson-poole.com', '+1-798-212-4265x714'),
(46, 'Rhodes Group', 'normangerald@edwards-myers.info', '(616)239-9461x99826'),
(47, 'Hardin, Hartman and Heath', 'erin72@ellis.com', '(857)485-9796x0760'),
(48, 'Adams-Strickland', 'hansonjon@moore.biz', '001-730-970-2294x0210'),
(49, 'Garcia-Brown', 'egarcia@lewis.com', '350.314.0738'),
(50, 'Sanders-Jacobson', 'paigesimpson@taylor.com', '425.720.3837x5396');

-- Roles
INSERT INTO role (role_id, name, description) VALUES
(1, 'warehouse_manager', 'Oversees all warehouse operations, staff, and safety.'),
(2, 'logistics_coordinator', 'Manages logistics and distribution processes.'),
(3, 'inventory_controller', 'Manages inventory accuracy, cycle counts, and stock reconciliation.'),
(4, 'receiving_clerk', 'Handles inbound shipments, inspects and records received goods.'),
(5, 'shipping_clerk', 'Prepares and processes outbound shipments and documentation.'),
(6, 'forklift_operator', 'Operates forklifts and other material handling equipment within the warehouse.'),
(7, 'safety_officer', 'Ensures safety and compliance in warehouse operations.'),
(8, 'returns_specialist', 'Handles returns and returns processing.'),
(9, 'customer_service', 'Handles customer inquiries and complaints.');

-- Storage Event Types
INSERT INTO storage_event_type (event_type_id, name, description) VALUES
(1, 'RECEIVED', 'Cargo received at warehouse'),
(2, 'MOVED', 'Cargo moved to another shelf'),
(3, 'DISPATCHED', 'Cargo dispatched from warehouse'),
(4, 'DAMAGED', 'Cargo found damaged'),
(5, 'LOST', 'Cargo missing or lost'),
(6, 'CUSTOMER_CONTACT', 'Contact with customer regarding storage'),
(7, 'QUALITY_ISSUE', 'Quality-related issue reported'),
(8, 'SAFETY_INCIDENT', 'Safety or accident incident reported');

-- Zones
INSERT INTO zone (zone_id, warehouse_id, name, description) VALUES
(1, 1, 'Bulk Storage Area', 'Area for storing large quantities of goods, usually on pallets.'),
(2, 1, 'Receiving Area', 'Zone designated for unloading and inspecting incoming goods.'),
(3, 1, 'Picking Area', 'Zone where items are picked to fulfill orders.'),
(4, 1, 'Packing Area', 'Area for packing picked items and preparing them for shipment.'),
(5, 1, 'Shipping Area', 'Zone for staging and loading outbound shipments.'),
(6, 1, 'Returns Area', 'Designated space for processing returned goods.'),
(7, 1, 'Quarantine/Inspection Area', 'Area for holding goods pending inspection or quality checks.');

-- Aisles
INSERT INTO aisle (aisle_id, zone_id, label, width, width_unit) VALUES
(1, 1, 'Aisle-1', 350, 'cm'),
(2, 1, 'Aisle-2', 300, 'cm'),
(3, 1, 'Aisle-3', 300, 'cm'),
(4, 1, 'Aisle-4', 350, 'cm'),
(5, 1, 'Aisle-5', 300, 'cm'),
(6, 1, 'Aisle-6', 250, 'cm'),
(7, 1, 'Aisle-7', 200, 'cm');

-- Racks
INSERT INTO rack (rack_id, aisle_id, label, max_height, height_unit) VALUES
(1, 1, 'R-001', 350, 'cm'),
(2, 2, 'R-002', 350, 'cm'),
(3, 3, 'R-003', 350, 'cm'),
(4, 4, 'R-004', 400, 'cm'),
(5, 5, 'R-005', 350, 'cm'),
(6, 6, 'R-006', 500, 'cm'),
(7, 7, 'R-007', 450, 'cm'),
(8, 1, 'R-008', 400, 'cm'),
(9, 2, 'R-009', 350, 'cm'),
(10, 3, 'R-010', 500, 'cm');

-- Shelves
INSERT INTO shelf (shelf_id, rack_id, level, max_weight, max_volume) VALUES
(1, 1, '1', 934, 15),
(2, 2, '2', 755, 14),
(3, 3, '3', 672, 8),
(4, 4, '4', 604, 10),
(5, 5, '1', 995, 13),
(6, 6, '2', 911, 14),
(7, 7, '3', 1059, 7),
(8, 8, '4', 1079, 9),
(9, 9, '1', 958, 15),
(10, 10, '2', 1109, 7),
(11, 1, '3', 640, 9),
(12, 2, '4', 1080, 13),
(13, 3, '1', 1100, 12),
(14, 4, '2', 1088, 13),
(15, 5, '3', 662, 10);

-- Employees
INSERT INTO employee (employee_id, name, email, phone, hire_date) VALUES
(1, 'Bryan Sutton', 'nicholasmcdaniel@example.com', '+1-963-643-0350x98318', '2024-06-19'),
(2, 'Riley Hobbs', 'madisonmonroe@example.net', '001-660-291-9501x502', '2025-04-19'),
(3, 'Brittany Aguilar', 'gjordan@example.org', '692-736-6034x7914', '2023-12-05'),
(4, 'David Davis', 'amy99@example.org', '417-840-3451', '2020-11-26'),
(5, 'Rebecca Barton', 'wilkinsonanthony@example.net', '3297651221', '2023-09-05'),
(6, 'Jacqueline Ortiz', 'veleztyler@example.org', '+1-976-311-0260', '2025-02-28'),
(7, 'Crystal Frye', 'jason40@example.net', '(611)425-7927x984', '2022-07-07'),
(8, 'Eric Vega', 'bellalvin@example.com', '412-376-3291x5897', '2023-04-05'),
(9, 'Amy Gordon', 'rhenderson@example.org', '787-768-0896x3532', '2023-10-18'),
(10, 'Lisa Williams', 'woodjulian@example.org', '(291)479-2480x34556', '2022-01-14'),
(11, 'William Brown', 'christopherlopez@example.com', '(601)273-4235x0815', '2024-09-18'),
(12, 'Anita Klein', 'longjack@example.net', '854.452.2498x2899', '2020-06-10'),
(13, 'James Rhodes', 'alexander59@example.com', '858.354.8315x122', '2021-01-28'),
(14, 'Ryan Perez', 'zatkins@example.net', '001-272-823-1039', '2023-02-11'),
(15, 'Debra Martinez', 'edwardsstephanie@example.com', '001-542-531-7028', '2020-09-22'),
(16, 'Austin Little', 'collinsmorgan@example.net', '431.932.5233x058', '2023-04-11'),
(17, 'Darrell Giles', 'sean54@example.org', '+1-435-560-3423', '2021-06-26'),
(18, 'Caitlin Miller', 'awebster@example.org', '+1-712-950-4125x804', '2020-07-16'),
(19, 'Nancy Hill', 'bautistabrett@example.com', '(780)496-1617x090', '2022-09-14'),
(20, 'Kristopher Perez', 'david23@example.com', '778.656.6893x9621', '2024-12-31');

-- Employee Roles
INSERT INTO employee_role (employee_id, role_id, assigned_date) VALUES
(1, 6, '2025-05-18'),
(2, 5, '2025-05-03'),
(3, 9, '2024-04-03'),
(4, 2, '2022-12-27'),
(5, 5, '2024-01-14'),
(5, 6, '2025-03-05'),
(6, 5, '2025-03-07'),
(6, 6, '2025-06-03'),
(7, 2, '2023-01-12'),
(8, 7, '2025-01-12'),
(9, 7, '2024-04-02'),
(10, 1, '2025-04-06'),
(10, 8, '2023-03-03'),
(11, 4, '2025-03-14'),
(11, 2, '2024-11-18'),
(12, 4, '2022-10-16'),
(13, 6, '2021-10-04'),
(13, 2, '2024-01-09'),
(14, 8, '2023-02-12'),
(15, 2, '2025-04-19'),
(15, 9, '2020-10-29'),
(16, 3, '2023-08-06'),
(17, 5, '2024-01-05'),
(18, 4, '2021-04-28'),
(19, 5, '2022-11-25'),
(20, 5, '2025-02-01');

-- Employee Warehouses
INSERT INTO employee_warehouse (employee_id, warehouse_id, assigned_from, assigned_until) VALUES
(1, 1, '2024-06-19', NULL),
(2, 1, '2025-04-19', NULL),
(3, 1, '2023-12-05', NULL),
(4, 1, '2020-11-26', NULL),
(5, 1, '2023-09-05', NULL),
(6, 1, '2025-02-28', NULL),
(7, 1, '2022-07-07', NULL),
(8, 1, '2023-04-05', NULL),
(9, 1, '2023-10-18', NULL),
(10, 1, '2022-01-14', NULL),
(11, 1, '2024-09-18', NULL),
(12, 1, '2020-06-10', NULL),
(13, 1, '2021-01-28', NULL),
(14, 1, '2023-02-11', NULL),
(15, 1, '2020-09-22', NULL),
(16, 1, '2023-04-11', NULL),
(17, 1, '2021-06-26', NULL),
(18, 1, '2020-07-16', NULL),
(19, 1, '2022-09-14', NULL),
(20, 1, '2024-12-31', NULL);

-- Storage Requests
INSERT INTO storage_request (request_id, warehouse_id, customer_id, requested_entry_date, requested_exit_date, status, decision_employee_id, decision_date) VALUES
(1, 1, 3, '2025-06-01 19:19', '2025-06-13 19:19', 'pending', NULL, NULL),
(2, 1, 42, '2025-05-17 08:55', '2025-05-24 08:55', 'accepted', NULL, '2025-05-14 08:55'),
(3, 1, 29, '2025-06-01 02:35', '2025-06-18 02:35', 'pending', NULL, NULL),
(4, 1, 21, '2025-06-04 02:12', '2025-06-10 02:12', 'pending', NULL, NULL),
(5, 1, 20, '2025-06-05 17:08', '2025-06-19 17:08', 'rejected', 6, '2025-06-04 17:08'),
(6, 1, 14, '2025-05-30 06:22', '2025-06-10 06:22', 'pending', NULL, NULL),
(7, 1, 38, '2025-06-03 10:30', '2025-06-15 10:30', 'pending', NULL, NULL),
(8, 1, 50, '2025-05-11 20:50', '2025-05-24 20:50', 'accepted', NULL, '2025-05-09 20:50'),
(9, 1, 1, '2025-06-04 12:11', '2025-06-20 12:11', 'pending', NULL, NULL),
(10, 1, 44, '2025-06-04 04:43', '2025-06-16 04:43', 'pending', NULL, NULL),
(11, 1, 1, '2025-05-22 17:13', '2025-06-09 17:13', 'pending', NULL, NULL),
(12, 1, 28, '2025-06-05 17:08', '2025-06-18 17:08', 'rejected', 13, '2025-06-02 17:08'),
(13, 1, 29, '2025-06-05 04:50', '2025-06-11 04:50', 'pending', NULL, NULL),
(14, 1, 45, '2025-05-08 10:02', '2025-05-19 10:02', 'accepted', NULL, '2025-05-08 10:02'),
(15, 1, 25, '2025-06-05 17:08', '2025-06-16 17:08', 'rejected', 13, '2025-06-04 17:08'),
(16, 1, 38, '2025-06-01 05:30', '2025-06-08 05:30', 'pending', NULL, NULL),
(17, 1, 49, '2025-06-01 08:05', '2025-06-13 08:05', 'pending', NULL, NULL),
(18, 1, 37, '2025-06-05 17:08', '2025-06-11 17:08', 'rejected', 5, '2025-06-04 17:08'),
(19, 1, 44, '2025-05-13 11:41', '2025-05-25 11:41', 'accepted', NULL, '2025-05-10 11:41'),
(20, 1, 45, '2025-05-30 19:20', '2025-06-12 19:20', 'pending', NULL, NULL),
(21, 1, 29, '2025-05-20 11:23', '2025-06-02 11:23', 'accepted', NULL, '2025-05-17 11:23'),
(22, 1, 41, '2025-05-31 20:23', '2025-06-17 20:23', 'accepted', NULL, '2025-05-30 20:23'),
(23, 1, 6, '2025-06-04 07:47', '2025-06-23 07:47', 'pending', NULL, NULL),
(24, 1, 26, '2025-05-31 22:00', '2025-06-13 22:00', 'accepted', NULL, '2025-05-31 22:00'),
(25, 1, 10, '2025-05-10 23:09', '2025-05-17 23:09', 'pending', NULL, NULL),
(26, 1, 7, '2025-05-25 19:30', '2025-06-09 19:30', 'accepted', NULL, '2025-05-24 19:30'),
(27, 1, 41, '2025-05-06 20:27', '2025-05-22 20:27', 'pending', NULL, NULL),
(28, 1, 2, '2025-05-30 06:10', '2025-06-13 06:10', 'pending', NULL, NULL),
(29, 1, 47, '2025-06-03 09:55', '2025-06-16 09:55', 'pending', NULL, NULL),
(30, 1, 27, '2025-05-29 22:55', '2025-06-04 22:55', 'pending', NULL, NULL),
(31, 1, 5, '2025-05-25 23:18', '2025-06-09 23:18', 'pending', NULL, NULL),
(32, 1, 39, '2025-06-02 11:52', '2025-06-10 11:52', 'accepted', NULL, '2025-05-31 11:52'),
(33, 1, 26, '2025-06-05 05:59', '2025-06-19 05:59', 'pending', NULL, NULL),
(34, 1, 38, '2025-06-05 13:20', '2025-06-21 13:20', 'pending', NULL, NULL),
(35, 1, 7, '2025-06-05 13:07', '2025-06-23 13:07', 'pending', NULL, NULL),
(36, 1, 3, '2025-06-02 02:48', '2025-06-11 02:48', 'pending', NULL, NULL),
(37, 1, 45, '2025-06-05 06:59', '2025-06-19 06:59', 'pending', NULL, NULL),
(38, 1, 38, '2025-06-02 12:21', '2025-06-21 12:21', 'pending', NULL, NULL),
(39, 1, 44, '2025-06-05 11:33', '2025-06-22 11:33', 'pending', NULL, NULL),
(40, 1, 38, '2025-06-03 07:22', '2025-06-16 07:22', 'accepted', NULL, '2025-06-01 07:22'),
(41, 1, 45, '2025-06-04 02:52', '2025-06-11 02:52', 'pending', NULL, NULL),
(42, 1, 26, '2025-06-05 01:23', '2025-06-12 01:23', 'pending', NULL, NULL),
(43, 1, 1, '2025-05-31 14:00', '2025-06-14 14:00', 'pending', NULL, NULL),
(44, 1, 35, '2025-06-05 00:53', '2025-06-23 00:53', 'accepted', NULL, '2025-06-04 00:53'),
(45, 1, 38, '2025-06-02 14:04', '2025-06-08 14:04', 'pending', NULL, NULL),
(46, 1, 47, '2025-06-03 16:32', '2025-06-13 16:32', 'pending', NULL, NULL),
(47, 1, 40, '2025-06-02 04:55', '2025-06-11 04:55', 'pending', NULL, NULL),
(48, 1, 42, '2025-06-02 21:29', '2025-06-10 21:29', 'accepted', NULL, '2025-05-31 21:29'),
(49, 1, 32, '2025-05-24 22:18', '2025-06-13 22:18', 'pending', NULL, NULL),
(50, 1, 39, '2025-06-02 17:12', '2025-06-10 17:12', 'pending', NULL, NULL),
(51, 1, 43, '2025-05-14 19:28', '2025-05-27 19:28', 'pending', NULL, NULL),
(52, 1, 29, '2025-06-01 03:33', '2025-06-09 03:33', 'pending', NULL, NULL),
(53, 1, 41, '2025-06-04 09:24', '2025-06-14 09:24', 'pending', NULL, NULL),
(54, 1, 36, '2025-06-01 22:34', '2025-06-17 22:34', 'pending', NULL, NULL),
(55, 1, 45, '2025-05-31 03:00', '2025-06-15 03:00', 'pending', NULL, NULL),
(56, 1, 42, '2025-06-05 08:18', '2025-06-18 08:18', 'pending', NULL, NULL),
(57, 1, 4, '2025-06-04 05:34', '2025-06-21 05:34', 'pending', NULL, NULL),
(58, 1, 40, '2025-05-29 17:20', '2025-06-18 17:20', 'pending', NULL, NULL),
(59, 1, 43, '2025-05-30 04:45', '2025-06-12 04:45', 'pending', NULL, NULL),
(60, 1, 41, '2025-05-11 09:51', '2025-05-18 09:51', 'pending', NULL, NULL),
(61, 1, 5, '2025-06-01 19:21', '2025-06-19 19:21', 'pending', NULL, NULL),
(62, 1, 37, '2025-06-03 16:00', '2025-06-09 16:00', 'pending', NULL, NULL),
(63, 1, 16, '2025-06-04 00:49', '2025-06-14 00:49', 'pending', NULL, NULL),
(64, 1, 9, '2025-05-22 01:53', '2025-05-27 01:53', 'accepted', NULL, '2025-05-20 01:53'),
(65, 1, 36, '2025-06-05 17:08', '2025-06-10 17:08', 'rejected', 16, '2025-06-04 17:08'),
(66, 1, 15, '2025-05-30 06:40', '2025-06-06 06:40', 'pending', NULL, NULL),
(67, 1, 40, '2025-06-05 17:08', '2025-06-10 17:08', 'rejected', 1, '2025-06-03 17:08'),
(68, 1, 39, '2025-05-29 22:12', '2025-06-16 22:12', 'pending', NULL, NULL),
(69, 1, 16, '2025-06-05 17:08', '2025-06-23 17:08', 'rejected', 14, '2025-06-05 17:08'),
(70, 1, 42, '2025-06-04 17:09', '2025-06-12 17:09', 'pending', NULL, NULL),
(71, 1, 46, '2025-06-02 14:21', '2025-06-16 14:21', 'pending', NULL, NULL),
(72, 1, 34, '2025-06-04 19:47', '2025-06-13 19:47', 'pending', NULL, NULL),
(73, 1, 28, '2025-05-09 09:39', '2025-05-26 09:39', 'accepted', NULL, '2025-05-07 09:39'),
(74, 1, 6, '2025-06-04 12:05', '2025-06-15 12:05', 'pending', NULL, NULL),
(75, 1, 17, '2025-06-05 17:08', '2025-06-17 17:08', 'rejected', 8, '2025-06-03 17:08'),
(76, 1, 41, '2025-05-15 10:06', '2025-06-04 10:06', 'accepted', NULL, '2025-05-12 10:06'),
(77, 1, 41, '2025-06-04 15:35', '2025-06-10 15:35', 'pending', NULL, NULL),
(78, 1, 30, '2025-06-05 17:08', '2025-06-19 17:08', 'rejected', 16, '2025-06-03 17:08'),
(79, 1, 5, '2025-05-31 10:14', '2025-06-05 10:14', 'pending', NULL, NULL),
(80, 1, 43, '2025-05-18 02:58', '2025-06-05 02:58', 'accepted', NULL, '2025-05-16 02:58'),
(81, 1, 44, '2025-05-23 16:50', '2025-06-03 16:50', 'accepted', NULL, '2025-05-20 16:50'),
(82, 1, 34, '2025-05-08 23:31', '2025-05-28 23:31', 'pending', NULL, NULL),
(83, 1, 41, '2025-05-24 11:54', '2025-06-07 11:54', 'accepted', NULL, '2025-05-22 11:54'),
(84, 1, 15, '2025-06-01 00:07', '2025-06-10 00:07', 'pending', NULL, NULL),
(85, 1, 19, '2025-05-13 07:30', '2025-05-22 07:30', 'accepted', NULL, '2025-05-12 07:30'),
(86, 1, 48, '2025-05-29 19:00', '2025-06-07 19:00', 'pending', NULL, NULL),
(87, 1, 42, '2025-06-04 19:47', '2025-06-11 19:47', 'accepted', NULL, '2025-06-04 19:47'),
(88, 1, 40, '2025-06-04 10:54', '2025-06-09 10:54', 'pending', NULL, NULL),
(89, 1, 11, '2025-05-21 09:33', '2025-06-08 09:33', 'pending', NULL, NULL),
(90, 1, 33, '2025-06-05 17:08', '2025-06-14 17:08', 'rejected', 3, '2025-06-04 17:08'),
(91, 1, 38, '2025-06-05 17:08', '2025-06-17 17:08', 'rejected', 4, '2025-06-03 17:08'),
(92, 1, 37, '2025-05-10 22:40', '2025-05-27 22:40', 'accepted', NULL, '2025-05-10 22:40'),
(93, 1, 39, '2025-06-01 18:12', '2025-06-09 18:12', 'pending', NULL, NULL),
(94, 1, 11, '2025-05-19 20:13', '2025-06-04 20:13', 'pending', NULL, NULL),
(95, 1, 1, '2025-05-31 11:21', '2025-06-15 11:21', 'pending', NULL, NULL),
(96, 1, 41, '2025-05-31 13:04', '2025-06-19 13:04', 'pending', NULL, NULL),
(97, 1, 11, '2025-05-07 04:01', '2025-05-14 04:01', 'accepted', NULL, '2025-05-07 04:01'),
(98, 1, 46, '2025-06-05 17:08', '2025-06-18 17:08', 'rejected', NULL, '2025-06-03 17:08'),
(99, 1, 20, '2025-05-31 02:55', '2025-06-09 02:55', 'pending', NULL, NULL),
(100, 1, 50, '2025-05-30 13:37', '2025-06-07 13:37', 'pending', NULL, NULL),
(101, 1, 48, '2025-05-07 00:44', '2025-05-25 00:44', 'accepted', NULL, '2025-05-04 00:44'),
(102, 1, 24, '2025-06-04 02:29', '2025-06-19 02:29', 'pending', NULL, NULL),
(103, 1, 50, '2025-05-31 10:17', '2025-06-13 10:17', 'pending', NULL, NULL),
(104, 1, 47, '2025-05-20 06:39', '2025-06-01 06:39', 'accepted', NULL, '2025-05-18 06:39'),
(105, 1, 25, '2025-06-04 23:25', '2025-06-19 23:25', 'pending', NULL, NULL),
(106, 1, 36, '2025-05-30 06:58', '2025-06-12 06:58', 'pending', NULL, NULL),
(107, 1, 25, '2025-06-02 03:32', '2025-06-11 03:32', 'pending', NULL, NULL),
(108, 1, 33, '2025-05-30 01:59', '2025-06-16 01:59', 'pending', NULL, NULL),
(109, 1, 12, '2025-05-31 06:51', '2025-06-19 06:51', 'pending', NULL, NULL),
(110, 1, 43, '2025-06-02 14:08', '2025-06-10 14:08', 'pending', NULL, NULL),
(111, 1, 33, '2025-06-05 17:08', '2025-06-13 17:08', 'rejected', 3, '2025-06-02 17:08'),
(112, 1, 13, '2025-05-31 08:36', '2025-06-05 08:36', 'pending', NULL, NULL),
(113, 1, 47, '2025-05-11 00:58', '2025-05-24 00:58', 'accepted', NULL, '2025-05-10 00:58'),
(114, 1, 13, '2025-05-30 04:47', '2025-06-11 04:47', 'pending', NULL, NULL),
(115, 1, 42, '2025-05-12 02:36', '2025-05-25 02:36', 'accepted', NULL, '2025-05-11 02:36'),
(116, 1, 28, '2025-05-08 11:44', '2025-05-17 11:44', 'accepted', NULL, '2025-05-08 11:44'),
(117, 1, 3, '2025-06-05 09:10', '2025-06-21 09:10', 'pending', NULL, NULL),
(118, 1, 47, '2025-05-15 20:57', '2025-05-27 20:57', 'accepted', NULL, '2025-05-14 20:57'),
(119, 1, 16, '2025-06-04 05:15', '2025-06-20 05:15', 'pending', NULL, NULL),
(120, 1, 15, '2025-05-24 13:43', '2025-06-09 13:43', 'accepted', NULL, '2025-05-21 13:43'),
(121, 1, 10, '2025-06-03 00:45', '2025-06-09 00:45', 'accepted', NULL, '2025-06-03 00:45'),
(122, 1, 48, '2025-05-12 22:35', '2025-05-27 22:35', 'accepted', NULL, '2025-05-10 22:35'),
(123, 1, 41, '2025-05-14 08:01', '2025-06-03 08:01', 'pending', NULL, NULL),
(124, 1, 11, '2025-06-04 21:51', '2025-06-17 21:51', 'accepted', NULL, '2025-06-01 21:51'),
(125, 1, 1, '2025-06-04 23:59', '2025-06-20 23:59', 'pending', NULL, NULL),
(126, 1, 45, '2025-05-31 15:39', '2025-06-11 15:39', 'pending', NULL, NULL),
(127, 1, 48, '2025-05-19 10:23', '2025-06-08 10:23', 'pending', NULL, NULL),
(128, 1, 7, '2025-06-04 01:39', '2025-06-18 01:39', 'pending', NULL, NULL),
(129, 1, 45, '2025-05-27 19:29', '2025-06-13 19:29', 'accepted', NULL, '2025-05-27 19:29'),
(130, 1, 42, '2025-05-25 22:38', '2025-05-31 22:38', 'pending', NULL, NULL),
(131, 1, 19, '2025-05-23 12:46', '2025-06-12 12:46', 'accepted', NULL, '2025-05-22 12:46'),
(132, 1, 24, '2025-06-02 09:07', '2025-06-18 09:07', 'pending', NULL, NULL),
(133, 1, 50, '2025-06-04 13:04', '2025-06-12 13:04', 'pending', NULL, NULL),
(134, 1, 31, '2025-06-05 17:08', '2025-06-19 17:08', 'rejected', 18, '2025-06-03 17:08'),
(135, 1, 21, '2025-05-31 02:05', '2025-06-09 02:05', 'pending', NULL, NULL),
(136, 1, 10, '2025-05-26 11:54', '2025-06-15 11:54', 'pending', NULL, NULL),
(137, 1, 6, '2025-05-16 05:54', '2025-05-22 05:54', 'accepted', NULL, '2025-05-14 05:54'),
(138, 1, 20, '2025-06-05 17:08', '2025-06-15 17:08', 'rejected', 16, '2025-06-05 17:08'),
(139, 1, 31, '2025-06-02 06:24', '2025-06-17 06:24', 'pending', NULL, NULL),
(140, 1, 37, '2025-06-04 17:32', '2025-06-20 17:32', 'pending', NULL, NULL),
(141, 1, 20, '2025-05-12 09:54', '2025-05-30 09:54', 'accepted', NULL, '2025-05-12 09:54'),
(142, 1, 28, '2025-05-17 07:08', '2025-05-24 07:08', 'pending', NULL, NULL),
(143, 1, 8, '2025-06-04 14:38', '2025-06-24 14:38', 'pending', NULL, NULL),
(144, 1, 23, '2025-06-01 03:17', '2025-06-20 03:17', 'pending', NULL, NULL),
(145, 1, 19, '2025-06-05 14:32', '2025-06-24 14:32', 'accepted', NULL, '2025-06-05 14:32'),
(146, 1, 1, '2025-05-13 03:52', '2025-05-31 03:52', 'pending', NULL, NULL),
(147, 1, 20, '2025-06-04 05:55', '2025-06-15 05:55', 'pending', NULL, NULL),
(148, 1, 17, '2025-05-30 05:40', '2025-06-10 05:40', 'pending', NULL, NULL),
(149, 1, 29, '2025-05-30 18:24', '2025-06-07 18:24', 'pending', NULL, NULL),
(150, 1, 35, '2025-06-03 04:11', '2025-06-08 04:11', 'pending', NULL, NULL),
(151, 1, 46, '2025-05-08 14:50', '2025-05-15 14:50', 'accepted', NULL, '2025-05-07 14:50'),
(152, 1, 15, '2025-05-18 06:58', '2025-05-30 06:58', 'pending', NULL, NULL),
(153, 1, 10, '2025-06-03 00:00', '2025-06-10 00:00', 'pending', NULL, NULL),
(154, 1, 50, '2025-06-05 17:08', '2025-06-20 17:08', 'rejected', NULL, '2025-06-02 17:08'),
(155, 1, 34, '2025-06-01 18:54', '2025-06-19 18:54', 'pending', NULL, NULL),
(156, 1, 24, '2025-06-05 12:52', '2025-06-10 12:52', 'pending', NULL, NULL),
(157, 1, 46, '2025-05-24 13:35', '2025-06-07 13:35', 'accepted', NULL, '2025-05-23 13:35'),
(158, 1, 34, '2025-05-16 03:01', '2025-05-28 03:01', 'accepted', NULL, '2025-05-13 03:01'),
(159, 1, 14, '2025-06-03 11:31', '2025-06-11 11:31', 'pending', NULL, NULL),
(160, 1, 50, '2025-05-29 19:37', '2025-06-10 19:37', 'pending', NULL, NULL),
(161, 1, 24, '2025-06-05 17:08', '2025-06-12 17:08', 'rejected', 11, '2025-06-03 17:08'),
(162, 1, 48, '2025-06-03 23:33', '2025-06-17 23:33', 'pending', NULL, NULL),
(163, 1, 16, '2025-05-12 03:18', '2025-05-26 03:18', 'pending', NULL, NULL),
(164, 1, 46, '2025-05-10 11:16', '2025-05-20 11:16', 'pending', NULL, NULL),
(165, 1, 25, '2025-06-03 07:38', '2025-06-20 07:38', 'pending', NULL, NULL),
(166, 1, 25, '2025-06-05 17:08', '2025-06-10 17:08', 'rejected', 15, '2025-06-03 17:08'),
(167, 1, 6, '2025-06-03 01:29', '2025-06-20 01:29', 'pending', NULL, NULL),
(168, 1, 22, '2025-06-02 02:18', '2025-06-10 02:18', 'pending', NULL, NULL),
(169, 1, 14, '2025-06-05 17:08', '2025-06-10 17:08', 'rejected', 7, '2025-06-05 17:08'),
(170, 1, 38, '2025-05-17 04:50', '2025-06-06 04:50', 'accepted', NULL, '2025-05-15 04:50'),
(171, 1, 3, '2025-05-08 22:36', '2025-05-14 22:36', 'accepted', NULL, '2025-05-08 22:36'),
(172, 1, 28, '2025-06-05 17:08', '2025-06-23 17:08', 'rejected', 1, '2025-06-05 17:08'),
(173, 1, 4, '2025-05-10 11:59', '2025-05-19 11:59', 'pending', NULL, NULL),
(174, 1, 44, '2025-06-02 15:48', '2025-06-10 15:48', 'accepted', NULL, '2025-06-02 15:48'),
(175, 1, 5, '2025-05-31 03:33', '2025-06-09 03:33', 'pending', NULL, NULL),
(176, 1, 14, '2025-05-25 13:33', '2025-06-01 13:33', 'pending', NULL, NULL),
(177, 1, 8, '2025-06-05 17:08', '2025-06-14 17:08', 'rejected', 20, '2025-06-03 17:08'),
(178, 1, 28, '2025-06-05 17:08', '2025-06-17 17:08', 'rejected', 3, '2025-06-03 17:08'),
(179, 1, 7, '2025-06-04 21:06', '2025-06-09 21:06', 'pending', NULL, NULL),
(180, 1, 50, '2025-06-01 13:23', '2025-06-17 13:23', 'pending', NULL, NULL),
(181, 1, 38, '2025-05-31 03:20', '2025-06-08 03:20', 'accepted', NULL, '2025-05-29 03:20'),
(182, 1, 38, '2025-06-05 17:08', '2025-06-25 17:08', 'rejected', NULL, '2025-06-05 17:08'),
(183, 1, 28, '2025-06-01 06:49', '2025-06-16 06:49', 'pending', NULL, NULL),
(184, 1, 10, '2025-06-05 17:08', '2025-06-24 17:08', 'rejected', 1, '2025-06-03 17:08'),
(185, 1, 30, '2025-05-19 05:36', '2025-06-01 05:36', 'accepted', NULL, '2025-05-18 05:36'),
(186, 1, 10, '2025-06-05 09:33', '2025-06-14 09:33', 'pending', NULL, NULL),
(187, 1, 12, '2025-05-21 11:21', '2025-06-03 11:21', 'accepted', NULL, '2025-05-20 11:21'),
(188, 1, 41, '2025-06-04 22:49', '2025-06-16 22:49', 'pending', NULL, NULL),
(189, 1, 3, '2025-05-18 05:57', '2025-05-26 05:57', 'accepted', NULL, '2025-05-17 05:57'),
(190, 1, 40, '2025-06-04 18:06', '2025-06-14 18:06', 'pending', NULL, NULL),
(191, 1, 39, '2025-06-05 17:08', '2025-06-16 17:08', 'rejected', 11, '2025-06-05 17:08'),
(192, 1, 50, '2025-05-19 16:59', '2025-05-27 16:59', 'accepted', NULL, '2025-05-18 16:59'),
(193, 1, 13, '2025-06-01 04:02', '2025-06-07 04:02', 'pending', NULL, NULL),
(194, 1, 3, '2025-06-04 07:03', '2025-06-23 07:03', 'pending', NULL, NULL),
(195, 1, 29, '2025-06-04 08:04', '2025-06-18 08:04', 'pending', NULL, NULL),
(196, 1, 10, '2025-05-18 17:44', '2025-05-28 17:44', 'accepted', NULL, '2025-05-18 17:44'),
(197, 1, 34, '2025-05-21 01:59', '2025-06-06 01:59', 'accepted', NULL, '2025-05-19 01:59'),
(198, 1, 47, '2025-06-05 09:05', '2025-06-18 09:05', 'pending', NULL, NULL),
(199, 1, 12, '2025-05-11 04:29', '2025-05-17 04:29', 'pending', NULL, NULL),
(200, 1, 11, '2025-05-27 05:25', '2025-06-01 05:25', 'pending', NULL, NULL);

-- Storage Reservations
INSERT INTO storage_reservation (reservation_id, request_id, customer_id, shelf_id, reserved_weight, reserved_volume, reserved_from, reserved_until, status) VALUES
(1, 2, 42, 1, 376, 4.98, '2025-05-17 08:55', '2025-05-24 08:55', 'active'),
(2, 8, 50, 2, 114, 1.61, '2025-05-11 20:50', '2025-05-24 20:50', 'active'),
(3, 14, 45, 3, 800, 8.48, '2025-05-08 10:02', '2025-05-19 10:02', 'active'),
(4, 19, 44, 4, 610, 4.57, '2025-05-13 11:41', '2025-05-25 11:41', 'active'),
(5, 21, 29, 5, 111, 2.07, '2025-05-20 11:23', '2025-06-02 11:23', 'active'),
(6, 22, 41, 6, 909, 9.72, '2025-05-31 20:23', '2025-06-17 20:23', 'active'),
(7, 24, 26, 7, 550, 8.92, '2025-05-31 22:00', '2025-06-13 22:00', 'active'),
(8, 26, 7, 8, 245, 4.84, '2025-05-25 19:30', '2025-06-09 19:30', 'active'),
(9, 32, 39, 9, 144, 4.97, '2025-06-02 11:52', '2025-06-10 11:52', 'active'),
(10, 40, 38, 10, 424, 4.69, '2025-06-03 07:22', '2025-06-16 07:22', 'active'),
(11, 44, 35, 11, 636, 8.54, '2025-06-05 00:53', '2025-06-23 00:53', 'active'),
(12, 48, 42, 12, 631, 7.79, '2025-06-02 21:29', '2025-06-10 21:29', 'active'),
(13, 64, 9, 13, 528, 5.43, '2025-05-22 01:53', '2025-05-27 01:53', 'active'),
(14, 73, 28, 14, 755, 6.02, '2025-05-09 09:39', '2025-05-26 09:39', 'active'),
(15, 76, 41, 15, 958, 7.01, '2025-05-15 10:06', '2025-06-04 10:06', 'active'),
(16, 80, 43, 1, 478, 8.04, '2025-05-18 02:58', '2025-06-05 02:58', 'active'),
(17, 81, 44, 2, 289, 5.26, '2025-05-23 16:50', '2025-06-03 16:50', 'active'),
(18, 83, 41, 3, 109, 1.38, '2025-05-24 11:54', '2025-06-07 11:54', 'active'),
(19, 85, 19, 4, 445, 9.79, '2025-05-13 07:30', '2025-05-22 07:30', 'active'),
(20, 87, 42, 5, 772, 6.91, '2025-06-04 19:47', '2025-06-11 19:47', 'active'),
(21, 92, 37, 6, 125, 2.69, '2025-05-10 22:40', '2025-05-27 22:40', 'active'),
(22, 97, 11, 7, 655, 5.95, '2025-05-07 04:01', '2025-05-14 04:01', 'active'),
(23, 101, 48, 8, 292, 7.85, '2025-05-07 00:44', '2025-05-25 00:44', 'active'),
(24, 104, 47, 9, 772, 6.09, '2025-05-20 06:39', '2025-06-01 06:39', 'active'),
(25, 113, 47, 10, 528, 1.27, '2025-05-11 00:58', '2025-05-24 00:58', 'active'),
(26, 115, 42, 11, 773, 9.51, '2025-05-12 02:36', '2025-05-25 02:36', 'active'),
(27, 116, 28, 12, 724, 7.81, '2025-05-08 11:44', '2025-05-17 11:44', 'active'),
(28, 118, 47, 13, 425, 4.95, '2025-05-15 20:57', '2025-05-27 20:57', 'active'),
(29, 120, 15, 14, 345, 6.36, '2025-05-24 13:43', '2025-06-09 13:43', 'active'),
(30, 121, 10, 15, 867, 2.98, '2025-06-03 00:45', '2025-06-09 00:45', 'active'),
(31, 122, 48, 1, 686, 8.5, '2025-05-12 22:35', '2025-05-27 22:35', 'active'),
(32, 124, 11, 2, 650, 3.44, '2025-06-04 21:51', '2025-06-17 21:51', 'active'),
(33, 129, 45, 3, 803, 8.53, '2025-05-27 19:29', '2025-06-13 19:29', 'active'),
(34, 131, 19, 4, 523, 1.59, '2025-05-23 12:46', '2025-06-12 12:46', 'active'),
(35, 137, 6, 5, 801, 4.88, '2025-05-16 05:54', '2025-05-22 05:54', 'active'),
(36, 141, 20, 6, 457, 6.87, '2025-05-12 09:54', '2025-05-30 09:54', 'active'),
(37, 145, 19, 7, 357, 6.43, '2025-06-05 14:32', '2025-06-24 14:32', 'active'),
(38, 151, 46, 8, 687, 1.99, '2025-05-08 14:50', '2025-05-15 14:50', 'active'),
(39, 157, 46, 9, 958, 6.24, '2025-05-24 13:35', '2025-06-07 13:35', 'active'),
(40, 158, 34, 10, 550, 7.42, '2025-05-16 03:01', '2025-05-28 03:01', 'active'),
(41, 170, 38, 11, 340, 2.73, '2025-05-17 04:50', '2025-06-06 04:50', 'active'),
(42, 171, 3, 12, 651, 9.04, '2025-05-08 22:36', '2025-05-14 22:36', 'active'),
(43, 174, 44, 13, 895, 2.68, '2025-06-02 15:48', '2025-06-10 15:48', 'active'),
(44, 181, 38, 14, 150, 6.25, '2025-05-31 03:20', '2025-06-08 03:20', 'active'),
(45, 185, 30, 15, 364, 4.7, '2025-05-19 05:36', '2025-06-01 05:36', 'active'),
(46, 187, 12, 1, 480, 8.26, '2025-05-21 11:21', '2025-06-03 11:21', 'active'),
(47, 189, 3, 2, 307, 7.62, '2025-05-18 05:57', '2025-05-26 05:57', 'active'),
(48, 192, 50, 3, 868, 5.41, '2025-05-19 16:59', '2025-05-27 16:59', 'active'),
(49, 196, 10, 4, 318, 7.31, '2025-05-18 17:44', '2025-05-28 17:44', 'active'),
(50, 197, 34, 5, 604, 8.52, '2025-05-21 01:59', '2025-06-06 01:59', 'active');

-- Storage Records
INSERT INTO storage_record (storage_record_id, request_id, customer_id, shelf_id, actual_entry_date, actual_exit_date, cargo_description, cargo_weight, cargo_volume) VALUES
(1, 2, 42, 1, '2025-05-17 08:55', NULL, 'Arm capital wife.', 518.91, 2.16),
(2, 8, 50, 2, '2025-05-11 20:50', '2025-05-14 20:50', 'Determine where how ok.', 572.32, 8.86),
(3, 14, 45, 3, '2025-05-08 10:02', '2025-05-09 10:02', 'Agreement later state senior similar.', 428.87, 3.46),
(4, 19, 44, 4, '2025-05-13 11:41', '2025-05-15 11:41', 'Science through material.', 619.83, 9.46),
(5, 21, 29, 5, '2025-05-20 11:23', NULL, 'Front analysis.', 153.98, 5.1),
(6, 22, 41, 6, '2025-05-31 20:23', '2025-06-07 20:23', 'Threat effect step side.', 857.62, 4.54),
(7, 24, 26, 7, '2025-05-31 22:00', '2025-06-08 22:00', 'Become too turn traditional.', 692.31, 3.64),
(8, 26, 7, 8, '2025-05-25 19:30', '2025-05-31 19:30', 'Soldier ball capital run.', 414.6, 6.04),
(9, 32, 39, 9, '2025-06-02 11:52', NULL, 'Race firm beat lose.', 846.8, 9.8),
(10, 40, 38, 10, '2025-06-03 07:22', NULL, 'National include stock large baby.', 596.38, 8.64),
(11, 44, 35, 11, '2025-06-05 00:53', NULL, 'Natural series.', 571.46, 9.2),
(12, 48, 42, 12, '2025-06-02 21:29', '2025-06-09 21:29', 'Today hair travel base decide.', 731.21, 4.07),
(13, 64, 9, 13, '2025-05-22 01:53', NULL, 'Maybe may down.', 180.37, 7.23),
(14, 73, 28, 14, '2025-05-09 09:39', NULL, 'Traditional become eight.', 524.36, 6.81),
(15, 76, 41, 15, '2025-05-15 10:06', '2025-05-20 10:06', 'Accept listen.', 176.83, 6.43),
(16, 80, 43, 1, '2025-05-18 02:58', '2025-05-27 02:58', 'Help past fish them.', 897.91, 5.87),
(17, 81, 44, 2, '2025-05-23 16:50', NULL, 'Job rather reveal drop.', 370.55, 5.5),
(18, 83, 41, 3, '2025-05-24 11:54', '2025-05-29 11:54', 'Myself institution chair international.', 622.4, 6.93),
(19, 85, 19, 4, '2025-05-13 07:30', NULL, 'Image political chair.', 432.41, 6.03),
(20, 87, 42, 5, '2025-06-04 19:47', '2025-06-07 19:47', 'One late.', 232.93, 6.53),
(21, 92, 37, 6, '2025-05-10 22:40', '2025-05-15 22:40', 'Reduce young risk cultural.', 698.64, 5.86),
(22, 97, 11, 7, '2025-05-07 04:01', NULL, 'Same nearly model statement.', 488.6, 6.46),
(23, 101, 48, 8, '2025-05-07 00:44', '2025-05-16 00:44', 'Difficult instead heart note kid.', 141.11, 3.03),
(24, 104, 47, 9, '2025-05-20 06:39', NULL, 'Hot any center.', 935.57, 9.82),
(25, 113, 47, 10, '2025-05-11 00:58', '2025-05-18 00:58', 'Image keep discuss.', 937.09, 2.76),
(26, 115, 42, 11, '2025-05-12 02:36', NULL, 'Itself they across throw.', 940.01, 5.31),
(27, 116, 28, 12, '2025-05-08 11:44', '2025-05-14 11:44', 'Not half.', 944.66, 4.16),
(28, 118, 47, 13, '2025-05-15 20:57', NULL, 'Space however together training.', 583.01, 4.01),
(29, 120, 15, 14, '2025-05-24 13:43', NULL, 'Deal training cell weight later.', 418.29, 3.04),
(30, 121, 10, 15, '2025-06-03 00:45', NULL, 'Road condition former.', 801.07, 2.66),
(31, 122, 48, 1, '2025-05-12 22:35', NULL, 'School traditional level.', 504.72, 1.43),
(32, 124, 11, 2, '2025-06-04 21:51', '2025-06-05 21:51', 'Guess fish cell.', 257.57, 2.71),
(33, 129, 45, 3, '2025-05-27 19:29', '2025-05-29 19:29', 'Interesting as positive.', 356.37, 6.8),
(34, 131, 19, 4, '2025-05-23 12:46', '2025-05-25 12:46', 'Language main western six.', 363.06, 7.18),
(35, 137, 6, 5, '2025-05-16 05:54', '2025-05-25 05:54', 'Always kid take.', 866.7, 4.74),
(36, 141, 20, 6, '2025-05-12 09:54', NULL, 'Shake budget investment would.', 495.78, 8.7),
(37, 145, 19, 7, '2025-06-05 14:32', NULL, 'Start region teacher boy.', 892.71, 7.63),
(38, 151, 46, 8, '2025-05-08 14:50', NULL, 'Give without cell behavior.', 762.59, 5.63),
(39, 157, 46, 9, '2025-05-24 13:35', NULL, 'Two ask.', 939.73, 5.33),
(40, 158, 34, 10, '2025-05-16 03:01', '2025-05-20 03:01', 'Their measure.', 757.88, 2.82),
(41, 170, 38, 11, '2025-05-17 04:50', NULL, 'When full any.', 139.7, 4.84),
(42, 171, 3, 12, '2025-05-08 22:36', NULL, 'A continue sometimes.', 633.95, 5.1),
(43, 174, 44, 13, '2025-06-02 15:48', '2025-06-06 15:48', 'Third that.', 240.53, 7.46),
(44, 181, 38, 14, '2025-05-31 03:20', NULL, 'Water growth.', 562.43, 1.55),
(45, 185, 30, 15, '2025-05-19 05:36', '2025-05-25 05:36', 'Science option explain sort.', 201.34, 7.0),
(46, 187, 12, 1, '2025-05-21 11:21', NULL, 'Form control.', 683.15, 4.66),
(47, 189, 3, 2, '2025-05-18 05:57', '2025-05-21 05:57', 'Region close owner oil.', 350.39, 3.6),
(48, 192, 50, 3, '2025-05-19 16:59', NULL, 'Prove know control kid.', 869.21, 7.48),
(49, 196, 10, 4, '2025-05-18 17:44', '2025-05-23 17:44', 'Mean deal guy leave interest.', 556.34, 8.04),
(50, 197, 34, 5, '2025-05-21 01:59', NULL, 'Development stay.', 471.15, 1.96);

-- Payments
INSERT INTO payment (payment_id, storage_record_id, customer_id, amount, currency, status, payment_date, external_reference) VALUES
(1, 1, 1, 1579.91, 'PLN', 'pending', NULL, 'PAY-20250605-0001'),
(2, 2, 2, 1210.54, 'EUR', 'failed', '2025-05-10 15:00', 'PAY-20250605-0002'),
(3, 3, 3, 731.91, 'EUR', 'cancelled', '2025-05-27 02:26', 'PAY-20250605-0003'),
(4, 4, 4, 646.41, 'USD', 'failed', '2025-05-30 13:17', 'PAY-20250605-0004'),
(5, 1, 5, 1271.35, 'USD', 'pending', NULL, 'PAY-20250605-0005'),
(6, 2, 6, 1751.31, 'USD', 'pending', NULL, 'PAY-20250605-0006'),
(7, 3, 7, 1040.89, 'USD', 'pending', NULL, 'PAY-20250605-0007'),
(8, 4, 8, 1335.06, 'EUR', 'pending', NULL, 'PAY-20250605-0008'),
(9, 1, 9, 727.78, 'PLN', 'pending', NULL, 'PAY-20250605-0009'),
(10, 2, 10, 1197.13, 'PLN', 'failed', '2025-05-21 17:50', 'PAY-20250605-0010'),
(11, 3, 11, 1291.67, 'PLN', 'paid', '2025-05-08 05:29', 'PAY-20250605-0011'),
(12, 4, 12, 1109.83, 'USD', 'cancelled', '2025-05-09 01:47', 'PAY-20250605-0012'),
(13, 1, 13, 1635.02, 'PLN', 'failed', '2025-06-02 12:30', 'PAY-20250605-0013'),
(14, 2, 14, 828.8, 'EUR', 'paid', '2025-05-21 11:03', 'PAY-20250605-0014'),
(15, 3, 15, 504.29, 'EUR', 'cancelled', '2025-05-10 05:52', 'PAY-20250605-0015'),
(16, 4, 16, 1238.64, 'USD', 'failed', '2025-05-24 04:54', 'PAY-20250605-0016'),
(17, 1, 17, 590.07, 'USD', 'paid', '2025-06-01 02:09', 'PAY-20250605-0017'),
(18, 2, 18, 1302.59, 'PLN', 'failed', '2025-05-19 17:19', 'PAY-20250605-0018'),
(19, 3, 19, 1709.25, 'USD', 'cancelled', '2025-06-04 06:43', 'PAY-20250605-0019'),
(20, 4, 20, 1916.41, 'USD', 'failed', '2025-05-12 18:54', 'PAY-20250605-0020'),
(21, 1, 21, 686.32, 'PLN', 'cancelled', '2025-05-09 07:57', 'PAY-20250605-0021'),
(22, 2, 22, 1084.59, 'EUR', 'pending', NULL, 'PAY-20250605-0022'),
(23, 3, 23, 662.96, 'EUR', 'failed', '2025-06-03 13:00', 'PAY-20250605-0023'),
(24, 4, 24, 804.27, 'PLN', 'cancelled', '2025-06-01 09:06', 'PAY-20250605-0024'),
(25, 1, 25, 1722.45, 'USD', 'paid', '2025-05-14 22:09', 'PAY-20250605-0025'),
(26, 2, 26, 734.65, 'PLN', 'failed', '2025-05-18 23:59', 'PAY-20250605-0026'),
(27, 3, 27, 521.67, 'EUR', 'pending', NULL, 'PAY-20250605-0027'),
(28, 4, 28, 1087.79, 'EUR', 'paid', '2025-05-18 13:59', 'PAY-20250605-0028'),
(29, 1, 29, 1573.8, 'PLN', 'cancelled', '2025-05-28 14:46', 'PAY-20250605-0029'),
(30, 2, 30, 717.03, 'USD', 'pending', NULL, 'PAY-20250605-0030'),
(31, 3, 31, 1120.64, 'USD', 'paid', '2025-06-05 14:19', 'PAY-20250605-0031'),
(32, 4, 32, 800.75, 'USD', 'cancelled', '2025-05-08 17:27', 'PAY-20250605-0032'),
(33, 1, 33, 904.72, 'EUR', 'failed', '2025-05-17 05:57', 'PAY-20250605-0033'),
(34, 2, 34, 652.89, 'USD', 'cancelled', '2025-05-11 11:18', 'PAY-20250605-0034'),
(35, 3, 35, 1496.7, 'PLN', 'failed', '2025-05-14 05:00', 'PAY-20250605-0035'),
(36, 4, 36, 1795.63, 'PLN', 'cancelled', '2025-05-27 23:48', 'PAY-20250605-0036'),
(37, 1, 37, 877.25, 'USD', 'cancelled', '2025-05-12 23:44', 'PAY-20250605-0037'),
(38, 2, 38, 1560.54, 'EUR', 'failed', '2025-05-12 01:02', 'PAY-20250605-0038'),
(39, 3, 39, 1449.94, 'EUR', 'failed', '2025-05-13 20:56', 'PAY-20250605-0039'),
(40, 4, 40, 1901.19, 'PLN', 'paid', '2025-05-29 05:20', 'PAY-20250605-0040');