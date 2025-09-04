-- Trigger-01: Create a wallet for a new customer as soon as one is created
DROP TRIGGER IF EXISTS create_wallet;
DELIMITER $$
CREATE TRIGGER create_wallet
AFTER INSERT ON customer
FOR EACH ROW
BEGIN
    DECLARE existing_wallet INT;
    SELECT COUNT(*) INTO existing_wallet 
    FROM wallet 
    WHERE customerID = NEW.customerID;
    
    IF existing_wallet = 0 THEN
        INSERT INTO wallet (customerID, balance) VALUES (NEW.customerID, 0);
    END IF;
END;
$$
DELIMITER ;

-- Trigger-02: Change delivery agent's availability to False when assigned
DROP TRIGGER IF EXISTS da_unavailable;
DELIMITER $$
CREATE TRIGGER da_unavailable
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    UPDATE delivery_agent 
    SET availability = FALSE
    WHERE daID = NEW.daID;
END;
$$
DELIMITER ;

-- Trigger-03: Change delivery agent's availability to True when all orders completed
DROP TRIGGER IF EXISTS da_available;
DELIMITER $$
CREATE TRIGGER da_available
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    DECLARE pending_orders INT;
    SELECT COUNT(*) INTO pending_orders
    FROM orders
    WHERE daID = NEW.daID AND delivery_date IS NULL;

    IF pending_orders = 0 THEN
        UPDATE delivery_agent
        SET availability = TRUE
        WHERE daID = NEW.daID;
    END IF;
END;
$$
DELIMITER ;
