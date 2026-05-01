CREATE TABLE IF NOT EXISTS menu_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS commands (
    id BIGSERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL,
    open_time TIMESTAMP NOT NULL,
    close_time TIMESTAMP NULL,
    total_value DOUBLE PRECISION NOT NULL DEFAULT 0,
    responsible_employee_id BIGINT NULL,
    CONSTRAINT fk_commands_responsible_employee
        FOREIGN KEY (responsible_employee_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL,
    order_time TIMESTAMP NOT NULL,
    command_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    CONSTRAINT fk_orders_command
        FOREIGN KEY (command_id) REFERENCES commands (id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_menu_item
        FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
);

CREATE INDEX IF NOT EXISTS idx_commands_status ON commands (status);
CREATE INDEX IF NOT EXISTS idx_commands_close_time ON commands (close_time);
CREATE INDEX IF NOT EXISTS idx_orders_command_id ON orders (command_id);
CREATE INDEX IF NOT EXISTS idx_orders_menu_item_id ON orders (menu_item_id);
