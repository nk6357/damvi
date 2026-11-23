import urllib.request,urllib.error,urllib.robotparser,concurrent.futures,json,re,pathlib,xml.etree.ElementTree as ET
base='https://damvi.ru'
def get(path,agent='Mozilla/5.0'):
 try:
  with urllib.request.urlopen(urllib.request.Request(base+path,headers={'User-Agent':agent}),timeout=30) as r:return r.status,dict(r.headers),r.read().decode('utf-8','replace')
 except urllib.error.HTTPError as e:return e.code,dict(e.headers),e.read().decode('utf-8','replace')
status,headers,xml=get('/sitemap.xml'); urls=[n.text for n in ET.fromstring(xml).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
rs,rh,robots=get('/robots.txt'); rp=urllib.robotparser.RobotFileParser(); rp.parse(robots.splitlines())
def audit(url):
 path=url.removeprefix(base); status,h,html=get(path); nojs=re.sub(r'<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>','',html,flags=re.S|re.I)
 meta=lambda n: re.search(r'<meta name="'+n+r'" content="([^"]*)"',html)
 return {'url':url,'status':status,'title':re.search(r'<title>(.*?)</title>',html).group(1),'h1_count':len(re.findall(r'<h1\b',nojs)),'text_without_js':len(re.sub('<[^>]+>',' ',nojs)),'robots':meta('robots').group(1) if meta('robots') else None,'header_robots':h.get('X-Robots-Tag'),'canonical':re.search(r'<link rel="canonical" href="([^"]+)"',html).group(1),'description':meta('description').group(1),'allowed':{a:rp.can_fetch(a,url) for a in ['Googlebot','Yandex','bingbot','OAI-SearchBot','PerplexityBot']}}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex: pages=list(ex.map(audit,urls))
probes={}
for p in ['/robots.txt','/llms.txt','/llms-full.txt','/googlef0cd9bf0538e0e60.html','/yandex_0af32123aa1d73be.html','/nonexistent-seo-check-20261124','/_pages/privacy.html','/api/contact.php']:
 s,h,b=get(p);probes[p]={'status':s,'robots':h.get('X-Robots-Tag')}
for a in ['Googlebot','YandexBot','bingbot']:
 s,h,b=get('/',a);probes[a]={'status':s,'contains_h1':'<h1' in b,'noindex':bool(re.search(r'<meta name="robots" content="[^"]*noindex',b))}
report={'sitemap_status':status,'urls':len(urls),'pages':pages,'probes':probes}
pathlib.Path('outputs').mkdir(exist_ok=True)
pathlib.Path('outputs/live-search-audit-2026-11-24.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'pages':len(pages),'all_200':all(p['status']==200 for p in pages),'all_h1':all(p['h1_count']==1 for p in pages),'unique_titles':len(set(p['title'] for p in pages)),'unique_descriptions':len(set(p['description'] for p in pages)),'all_indexable':all('noindex' not in str(p['robots'])+str(p['header_robots']) and all(p['allowed'].values()) for p in pages),'min_nojs_text':min(p['text_without_js'] for p in pages),'probes':probes},ensure_ascii=False,indent=2))
