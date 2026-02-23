import sqlite3

def find_string_in_db(db_path, search_str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    
    results = []
    for table in tables:
        try:
            # Get columns for this table
            cursor.execute(f"PRAGMA table_info({table});")
            columns = [c[1] for c in cursor.fetchall()]
            
            for col in columns:
                try:
                    query = f"SELECT * FROM {table} WHERE {col} LIKE ?"
                    cursor.execute(query, (f"%{search_str}%",))
                    rows = cursor.fetchall()
                    if rows:
                        results.append(f"Table: {table}, Column: {col}, Found: {len(rows)} rows")
                        for row in rows:
                            results.append(f"  Row: {row}")
                except sqlite3.OperationalError:
                    # Some columns might not be text-searchable
                    continue
        except Exception as e:
            print(f"Error searching table {table}: {e}")
            
    conn.close()
    return results

if __name__ == "__main__":
    found = find_string_in_db('db.sqlite3', 'ameerpet')
    if found:
        print("\n".join(found))
    else:
        print("Not found")

    print("\n--- Searching for phone number ---")
    found_phone = find_string_in_db('db.sqlite3', '8327766246')
    if found_phone:
        print("\n".join(found_phone))
    else:
        print("Phone not found")
