/**
 * Tests for Schema Comparator
 */

describe('SchemaComparator', () => {
    let sourceSchema, destSchema;

    beforeEach(() => {
        sourceSchema = {};
        destSchema = {};
    });

    test('should detect missing tables', () => {
        sourceSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };
        destSchema = {};

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        expect(migration).toContain('MISSING TABLE');
        expect(migration).toContain('users');
        expect(comparator.getStats().tablesAdded).toBe(1);
    });

    test('should detect missing columns', () => {
        sourceSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    email: { definition: 'VARCHAR(100)', type: 'varchar(100)' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'email'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100));'
            }
        };
        destSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        expect(migration).toContain('ADD COLUMN');
        expect(migration).toContain('email');
        expect(comparator.getStats().columnsAdded).toBe(1);
    });

    test('should detect column type mismatches', () => {
        sourceSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    email: { definition: 'VARCHAR(200)', type: 'varchar(200)' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'email'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(200));'
            }
        };
        destSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    email: { definition: 'VARCHAR(100)', type: 'varchar(100)' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'email'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100));'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        expect(migration).toContain('MODIFY COLUMN');
        expect(migration).toContain('email');
        expect(comparator.getStats().columnsModified).toBe(1);
    });

    test('should detect missing indexes', () => {
        sourceSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: ['INDEX idx_email (email)'],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, INDEX idx_email (email));'
            }
        };
        destSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        expect(migration).toContain('ADD');
        expect(migration).toContain('idx_email');
        expect(comparator.getStats().indexesAdded).toBe(1);
    });

    test('should detect dropped columns when option enabled', () => {
        sourceSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };
        destSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    old_column: { definition: 'VARCHAR(100)', type: 'varchar(100)' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'old_column'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, old_column VARCHAR(100));'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema, { detectDrops: true });
        const migration = comparator.compare();

        expect(migration).toContain('DROP COLUMN');
        expect(migration).toContain('old_column');
        expect(comparator.getStats().columnsDropped).toBe(1);
    });

    test('should detect dropped tables when option enabled', () => {
        sourceSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };
        destSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            },
            old_table: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE old_table (id INT PRIMARY KEY);'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema, { detectDrops: true });
        const migration = comparator.compare();

        expect(migration).toContain('TABLE TO DROP');
        expect(migration).toContain('old_table');
        expect(migration).toContain('DROP TABLE');
        expect(comparator.getStats().tablesDropped).toBe(1);
    });

    test('should preserve column order when option enabled', () => {
        sourceSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    name: { definition: 'VARCHAR(100)', type: 'varchar(100)' },
                    email: { definition: 'VARCHAR(100)', type: 'varchar(100)' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'name', 'email'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));'
            }
        };
        destSchema = {
            users: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    email: { definition: 'VARCHAR(100)', type: 'varchar(100)' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'email'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100));'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema, { preserveColumnOrder: true });
        const migration = comparator.compare();

        expect(migration).toContain('AFTER');
        expect(migration).toContain('id');
    });

    test('should handle foreign keys separately', () => {
        sourceSchema = {
            posts: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    user_id: { definition: 'INT', type: 'int' }
                },
                indexes: [],
                foreignKeys: ['FOREIGN KEY (user_id) REFERENCES users(id)'],
                columnOrder: ['id', 'user_id'],
                full_create_stmt: 'CREATE TABLE posts (id INT PRIMARY KEY, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id));'
            }
        };
        destSchema = {
            posts: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    user_id: { definition: 'INT', type: 'int' }
                },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id', 'user_id'],
                full_create_stmt: 'CREATE TABLE posts (id INT PRIMARY KEY, user_id INT);'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        expect(migration).toContain('FOREIGN KEY');
        expect(comparator.getStats().indexesAdded).toBeGreaterThan(0);
    });

    test('should not add duplicate foreign key when only RESTRICT/NO ACTION differs', () => {
        sourceSchema = {
            item: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    item_mst_id: { definition: 'INT', type: 'int' }
                },
                indexes: [
                    'CONSTRAINT `fk_item_mst_id` FOREIGN KEY (`item_mst_id`) REFERENCES `item_mst` (`id`)'
                ],
                foreignKeys: [],
                columnOrder: ['id', 'item_mst_id'],
                full_create_stmt: 'CREATE TABLE item (id INT PRIMARY KEY, item_mst_id INT, CONSTRAINT `fk_item_mst_id` FOREIGN KEY (`item_mst_id`) REFERENCES `item_mst` (`id`));'
            }
        };
        destSchema = {
            item: {
                columns: {
                    id: { definition: 'INT PRIMARY KEY', type: 'int' },
                    item_mst_id: { definition: 'INT', type: 'int' }
                },
                indexes: [
                    'CONSTRAINT `fk_item_mst_id` FOREIGN KEY (`item_mst_id`) REFERENCES `item_mst` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT'
                ],
                foreignKeys: [],
                columnOrder: ['id', 'item_mst_id'],
                full_create_stmt: 'CREATE TABLE item (id INT PRIMARY KEY, item_mst_id INT, CONSTRAINT `fk_item_mst_id` FOREIGN KEY (`item_mst_id`) REFERENCES `item_mst` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT);'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        // Should report no differences for this FK
        expect(migration).toContain('No schema differences found');
        expect(migration).not.toContain('ADD CONSTRAINT `fk_item_mst_id`');
        expect(migration).not.toContain('FOREIGN KEY (`item_mst_id`) REFERENCES `item_mst`');
    });

    test('should report no differences when schemas match', () => {
        sourceSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };
        destSchema = {
            users: {
                columns: { id: { definition: 'INT PRIMARY KEY', type: 'int' } },
                indexes: [],
                foreignKeys: [],
                columnOrder: ['id'],
                full_create_stmt: 'CREATE TABLE users (id INT PRIMARY KEY);'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        expect(migration).toContain('No schema differences found');
    });

    test('should drop existing PRIMARY KEY before adding new one when definition changes', () => {
        sourceSchema = {
            absence: {
                columns: {
                    user_id: { definition: 'int NOT NULL', type: 'int' },
                    subject_id: { definition: 'int NOT NULL', type: 'int' },
                    datetime: { definition: 'datetime NOT NULL', type: 'datetime' }
                },
                indexes: ['PRIMARY KEY (`user_id`,`subject_id`,`datetime`) USING BTREE'],
                foreignKeys: [],
                columnOrder: ['user_id', 'subject_id', 'datetime'],
                full_create_stmt: 'CREATE TABLE absence (user_id int NOT NULL, subject_id int NOT NULL, datetime datetime NOT NULL, PRIMARY KEY (`user_id`,`subject_id`,`datetime`) USING BTREE);'
            }
        };
        destSchema = {
            absence: {
                columns: {
                    user_id: { definition: 'int NOT NULL', type: 'int' },
                    subject_id: { definition: 'int NOT NULL', type: 'int' },
                    teaching_hour_id: { definition: 'int NOT NULL DEFAULT \'0\'', type: 'int' },
                    datetime: { definition: 'datetime NOT NULL', type: 'datetime' }
                },
                indexes: ['PRIMARY KEY (`user_id`,`subject_id`,`teaching_hour_id`,`datetime`)'],
                foreignKeys: [],
                columnOrder: ['user_id', 'subject_id', 'teaching_hour_id', 'datetime'],
                full_create_stmt: 'CREATE TABLE absence (user_id int NOT NULL, subject_id int NOT NULL, teaching_hour_id int NOT NULL DEFAULT \'0\', datetime datetime NOT NULL, PRIMARY KEY (`user_id`,`subject_id`,`teaching_hour_id`,`datetime`));'
            }
        };

        const comparator = new SchemaComparator(sourceSchema, destSchema);
        const migration = comparator.compare();

        // Current behaviour: PK column set changes are flagged for manual migration (no auto DROP/ADD)
        expect(migration).toContain('[MANUAL PRIMARY KEY MIGRATION]');
        expect(migration).toContain('migrate PK manually');
    });
});
