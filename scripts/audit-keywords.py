"""Literal keyword coverage in the production build; not a ranking prediction."""
import csv
import re
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]

def norm(value):
    return re.sub(r'[^\w]+',' ',value.casefold().replace('ё','е')).strip()

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.fields={'Title':[], 'Description':[], 'H1':[], 'H2–H4':[], 'Текст страницы':[]}
        self.in_main=False
        self.in_title=False
        self.heading=None
        self.skip=0
        self.feed(html)
        self.fields={k:norm(' '.join(v)) for k,v in self.fields.items()}
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag in ('script','style'):self.skip+=1
        if tag=='main':self.in_main=True
        if tag=='title':self.in_title=True
        if tag in ('h1','h2','h3','h4'):self.heading=tag
        if tag=='meta' and attrs.get('name')=='description':self.fields['Description'].append(attrs.get('content',''))
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.skip=max(0,self.skip-1)
        if tag=='main':self.in_main=False
        if tag=='title':self.in_title=False
        if tag==self.heading:self.heading=None
    def handle_data(self,data):
        if self.skip:return
        if self.in_title:self.fields['Title'].append(data)
        if self.in_main:
            self.fields['Текст страницы'].append(data)
            if self.heading=='h1':self.fields['H1'].append(data)
            elif self.heading:self.fields['H2–H4'].append(data)

def main():
    seo=ROOT/'seo'
    with (seo/'keywords-1000/all-services-17000.csv').open(encoding='utf-8-sig',newline='') as f:
        candidates=list(csv.DictReader(f))
    pages={}
    rows=[]
    summary={}
    for row in candidates:
        path=row['Страница']
        if path not in pages:
            html=(ROOT/'dist/beget/public_html/_pages'/ (path.lstrip('/')+'.html')).read_text()
            pages[path]=Page(html)
            summary[path]=Counter(total=0,found=0,not_found=0,measured=0)
        page=pages[path]
        phrase=norm(row['Фраза'])
        found=[field for field,text in page.fields.items() if ' '+phrase+' ' in ' '+text+' ']
        counter=summary[path]
        counter['total']+=1
        counter['found' if found else 'not_found']+=1
        if row['Широкая частотность Wordstat']:counter['measured']+=1
        status='Буквально присутствует в сборке' if found else 'Не опубликована; требуется отбор'
        action='Проверить индексацию и фактические запросы после запуска' if found else 'Проверить спрос и выдачу; отобрать для полезного текста, не вставлять списком'
        rows.append([path,row['Фраза'],status,'; '.join(found),row['Статус проверки'],row['Широкая частотность Wordstat'],action])
    with (seo/'keyword-coverage-17000.csv').open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.writer(f);w.writerow(['Страница','Фраза','Размещение','Где найдена','Проверка спроса','Широкая частотность Wordstat','Следующий шаг']);w.writerows(rows)
    with (seo/'keyword-coverage-summary.csv').open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.writer(f);w.writerow(['Страница','Проверено кандидатов','Найдено буквально','Не опубликовано','Измерено в Wordstat'])
        for path,c in summary.items():w.writerow([path,c['total'],c['found'],c['not_found'],c['measured']])
    total=sum(c['total'] for c in summary.values())
    found=sum(c['found'] for c in summary.values())
    assert total==17000 and len(pages)==17
    (seo/'Проверка-размещения-ключей.txt').write_text(f'''ПРОВЕРКА РАЗМЕЩЕНИЯ КЛЮЧЕЙ DAMVI
Проверена основная HTML-сборка для damvi.ru, не публичная поисковая выдача.
Услуг: {len(pages)}. Проверено фраз-кандидатов: {total}.
Буквально найдены на своих страницах: {found}.
Не опубликованы: {total-found}.

Проверяются Title, Description, H1, H2–H4 и текст страницы в первоначальном HTML.
JSON-LD, скрипты и стили не засчитываются как видимый текст.
FAQ находится в HTML; ответы раскрываются посетителем без дополнительных запросов.
Регистр, дефисы, пунктуация и ё/е нормализованы. Морфология и синонимы не оценивались.
Наличие фразы в заголовке или тексте не означает гарантированных показов или позиций.
Отсутствие буквальной фразы не означает, что страница не релевантна её смыслу.

Большая часть сгенерированных вариантов намеренно не добавлена на страницы.
Это исследовательские гипотезы с непроверенным спросом, а не обязательные слова.
Не нужно получать 100% буквального покрытия за счёт скрытых или повторяющихся списков.

Полная проверка: keyword-coverage-17000.csv.
Сводка по услугам: keyword-coverage-summary.csv.
Повторить после сборки: python3 scripts/audit-keywords.py.

Для всех 26 страниц отдельно проверяются метаданные, H1, canonical, карта сайта,
структурированные данные, внутренние ссылки и ресурсы: node scripts/check-seo.mjs.
Для 17 услуг добавлены 68 ответов на вопросы и ссылки на связанные услуги.
Черновики политики и согласия остаются noindex до утверждения схемы обработки.
GitHub Pages и localhost остаются noindex, основная версия предназначена для Beget.
Чтобы попасть в выдачу, требуется размещение на damvi.ru и фактическая индексация.
Первую позицию по всем запросам настройкой HTML обеспечить нельзя.
''')
    print(f'Checked {total} candidates across {len(pages)} services: {found} literal matches, {total-found} intentionally not published. See seo/keyword-coverage-17000.csv.')

if __name__=='__main__':main()
