import csv
import os
import re

class UIUXCore:
    def __init__(self, data_dir):
        self.data_dir = data_dir
        self.databases = {}
        self.load_all_databases()

    def load_all_databases(self):
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.csv'):
                db_name = filename[:-4]
                self.databases[db_name] = self.load_csv(os.path.join(self.data_dir, filename))
        
        stacks_dir = os.path.join(self.data_dir, 'stacks')
        if os.path.exists(stacks_dir):
            for filename in os.listdir(stacks_dir):
                if filename.endswith('.csv'):
                    db_name = f"stack_{filename[:-4]}"
                    self.databases[db_name] = self.load_csv(os.path.join(stacks_dir, filename))

    def load_csv(self, filepath):
        data = []
        try:
            with open(filepath, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    data.append(row)
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
        return data

    def search(self, db_name, query, keys=['Keywords', 'Product Type', 'Style Category', 'Pattern Name']):
        if db_name not in self.databases:
            return []
        
        query = query.lower()
        query_words = set(query.split())
        results = []
        for row in self.databases[db_name]:
            score = 0
            # 1. Exact match on Product Type gets highest priority
            if 'Product Type' in row and query == row['Product Type'].lower():
                score += 100
            
            for key in keys:
                if key in row:
                    val = row[key].lower()
                    # 2. Query as a substring gets high score
                    if query in val:
                        score += 20
                    
                    # 3. Individual word matching
                    val_words = set(re.findall(r'\w+', val))
                    match_count = len(query_words.intersection(val_words))
                    score += match_count * 5
                    
                    # 4. Weight Product Type more heavily
                    if key == 'Product Type' and match_count > 0:
                        score += 30
            
            if score > 0:
                row['_score'] = score
                results.append(row)
        
        return sorted(results, key=lambda x: x.get('_score', 0), reverse=True)

    def get_recommendation(self, project_query):
        # 1. Find product type
        products = self.search('products', project_query)
        if not products:
            return None
        
        top_product = products[0]
        style_name = top_product.get('Primary Style Recommendation', '').split(' + ')[0]
        
        # 2. Find style details
        styles = self.search('styles', style_name, keys=['Style Category'])
        style_detail = styles[0] if styles else {}
        
        # 3. Find colors
        colors = self.search('colors', top_product.get('Product Type', ''))
        color_detail = colors[0] if colors else {}
        
        # 4. Find typography
        # Use style keywords to find best typography
        typo_query = f"{style_name} {top_product.get('Product Type', '')}"
        typos = self.search('typography', typo_query, keys=['Mood/Style Keywords', 'Best For'])
        typo_detail = typos[0] if typos else {}
        
        # 5. Find landing pattern
        pattern_name = top_product.get('Landing Page Pattern', '').split(' + ')[0]
        patterns = self.search('landing', pattern_name, keys=['Pattern Name'])
        pattern_detail = patterns[0] if patterns else {}

        return {
            'product': top_product,
            'style': style_detail,
            'colors': color_detail,
            'typography': typo_detail,
            'landing': pattern_detail
        }
