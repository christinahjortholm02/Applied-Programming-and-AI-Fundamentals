import csv, os, sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")
if not url or not key:
    sys.exit("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env")
supabase = create_client(url, key)

def write(limit=None):
    with open("books.csv", newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if limit:
        rows = rows[:limit]
    books = {}
    for r in rows:
        books[r["url"]] = {
            "title": r["title"],
            "price_gbp": float(str(r["price_gbp"]).replace("£", "")),
            "rating": int(r["rating"]),
            "availability": r["availability"],
            "url": r["url"],
        }
    books = list(books.values())
    for i in range(0, len(books), 500):
        supabase.table("books").upsert(books[i:i+500], on_conflict="url").execute()
    print(f"Uploaded {len(books)} books to Supabase")

def read():
    res = supabase.table("books").select("title, price_gbp, rating, availability").order("id").limit(1000).execute()
    for b in res.data:
        print(f'{b["title"][:50]:50}  £{b["price_gbp"]:>6}  {b["rating"]}★  {b["availability"]}')
    print(f"\n{len(res.data)} books in the table")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "write":
        write(int(sys.argv[2]) if len(sys.argv) > 2 else None)
    elif cmd == "read":
        read()
    else:
        print("Use: python3 supabase_books.py write [N]  or  python3 supabase_books.py read")
