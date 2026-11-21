import yaml,json,glob,csv,os,sys
P='/mnt/project-files/'
files=[P+'a1-01-greetings.yaml',P+'a1-02-alphabet.yaml']+sorted(glob.glob(P+'video-pipeline/pc/a1-*.yaml'))
files=[f for f in files if not (f.startswith(P+'video-pipeline/pc/a1-0') and os.path.basename(f)[:5] in('a1-01','a1-02'))]
eps={r['code']:r for r in csv.DictReader(open(P+'curriculum/episodes.csv'))}
ar={}
for f in glob.glob(P+'video-pipeline/arabic-a2/*.ar.yaml'):
    ar.update(yaml.safe_load(open(f))['strings'])
out=[]
def A(s): return ar.get(s) if isinstance(s,str) else None
for f in files:
    y=yaml.safe_load(open(f)); n=y['episode']; code=f"A1-{n:02d}"; e=eps[code]
    L={'id':y['id'],'code':code,'n':n,'unit':e['unit'],'titleFr':y['title']['fr'],'titleEn':y['title']['en'],
       'objectives':e['objectives'],'grammar':e['grammar'],'length':e['length'],'hook':y.get('youtube',{}).get('hook',''),
       'vocab':[],'explain':[],'quiz':[],'dialogue':None,'recap':[]}
    L['titleAr']=A(y['title']['en']); L['hookAr']=A(L['hook'])
    for s in y['scenes']:
        t=s['type']
        if t=='vocab':
            g={'heading':s['heading'].get('en'),'headingAr':A(s['heading'].get('en')),'items':[]}
            for i in s['items']:
                g['items'].append({k:i.get(k) for k in('fr','en','pron','icon')}|{'ar':A(i.get('en'))})
            L['vocab'].append(g)
        elif t=='explain':
            L['explain'].append({'heading':s['heading'].get('en'),'headingAr':A(s['heading'].get('en')),'points':[{'icon':p.get('icon'),'en':p.get('en'),'ar':A(p.get('en'))} for p in s.get('points',[])]})
        elif t=='quiz':
            q=s['question'];L['quiz'].append({'kind':'quiz','q':q['en'],'qAr':A(q['en']),'options':s['options'],'answer':s['answer'],'why':(s.get('explanation') or {}).get('en'),'whyAr':A((s.get('explanation') or {}).get('en'))})
        elif t=='fill_blank':
            for i in s['items']:
                L['quiz'].append({'kind':'fill','q':i['sentence'],'hint':i.get('en'),'hintAr':A(i.get('en')),'options':i['options'],'answer':i['answer']})
        elif t=='listen':
            for i in s['items']:
                L['quiz'].append({'kind':'listen','say':i['fr'],'options':i['options'],'optionsAr':[A(o) for o in i['options']],'answer':i['answer'],'why':(i.get('explanation') or {}).get('en')})
        elif t=='dialogue' and not L['dialogue']:
            sp=s['speakers'];L['dialogue']={'heading':s['heading'].get('en'),'setting':s.get('setting'),'lines':[{'who':sp[x['speaker']]['name'],'side':sp[x['speaker']].get('side'),'fr':x['fr'],'en':x['en'],'ar':A(x['en'])} for x in s['exchange']]}
        elif t=='recap':
            L['recap']=s.get('items',[])
    out.append(L)
out.sort(key=lambda l:l['n'])
print(len(out),[ (l['code'],len(l['quiz']),sum(len(g['items']) for g in l['vocab'])) for l in out],file=sys.stderr)
json.dump(out,open('lessons.json','w'),ensure_ascii=False,indent=1)
