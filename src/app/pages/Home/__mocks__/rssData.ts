export const rssData = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="pretty-atom-feed.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
    <title>Blog Title</title>
    <subtitle>This is a longer description about your blog.</subtitle>
    <link href="https://example.com/feed/feed.xml" rel="self" />
    <link href="https://example.com/" />
    <updated>2025-05-22T00:00:00Z</updated>
    <id>https://example.com/</id>
    <author>
        <name>Your Name</name>
    </author>
    <entry>
        <title>From Agile to Apathy: Why Google Didn’t Work for Me.</title>
        <link href="https://example.com/blog/20250522-google/" />
        <updated>2025-05-22T00:00:00Z</updated>
        <id>https://example.com/blog/20250522-google/</id>
        <content type="html">&lt;p&gt;I recently left Google after nearly four years. I wish I could say it lives up to all the hype, but it didn&#39;t. I honestly felt like I did some of the worst work of my career there. The environment, the processes, and team dynamics simply didn&#39;t align with my approach for how to collaborate and ship software. I&#39;ve been reflecting on exactly why I wasn&#39;t able to make it work for me.&lt;/p&gt;
&lt;p&gt;Just to brace you, I know just how ranty this is going to sound. I&#39;m not writing this as a condemnation of Google, because I know there are people that thrive and enjoy working there. This is just my own personal perspective on it. Take it with a grain of salt.&lt;/p&gt;
&lt;h2 id=&quot;agile-is-a-sin&quot;&gt;Agile is a Sin&lt;/h2&gt;
&lt;p&gt;I come from companies that do agile processes. It&#39;s not perfect, but it&#39;s empowering and very adaptive to change. I&#39;ve been told that agile processes do not scale. So when I joined Google, I was extremely interested in learning how and what Google does to ship software. They must be doing something slightly different or better to ship software at scale, right?&lt;/p&gt;
&lt;p&gt;Wrong. They quite literally don&#39;t have processes around collaboration. It&#39;s basically waterfall. Product writes up a doc. Gets buy-in from leadership. Tosses it at engineering. And then we never see them again, so we&#39;re left to implement it as we see fit.&lt;/p&gt;
&lt;p&gt;It is literally the most expensive and high risk software development I&#39;ve seen in my entire career. They basically have blind faith they&#39;ve hired super smart people that will just magically build the perfect product. Which to be fair, they do quite literally have a lot of &lt;em&gt;rock star&lt;/em&gt; developers. But relying on purely heroics to ship software is a recipe for burn out and knowledge silos.&lt;/p&gt;
&lt;p&gt;Also, they don&#39;t ship software. Deadlines are arbitrary. There are so many times when we approach a deadline only for &amp;quot;X&amp;quot; feature needs to absolutely be there on release so we&#39;ll just push out the release. I think deadlines are stupid, so I don&#39;t want to pretend like I care about them. But I do care about shipping software. The sooner you ship, the sooner you can start to learn and prove that your core assumptions are right or wrong. So to ship sooner, you need to downscope. If your MVP (minimal viable product) requires several really difficult features to implement, maybe it&#39;s not an MVP anymore. But then again, I guess no one called it an MVP, but me, who is used to shipping software regularly.&lt;/p&gt;
&lt;h2 id=&quot;the-doc-machine&quot;&gt;The Doc Machine&lt;/h2&gt;
&lt;p&gt;So, if you&#39;re not regularly shipping software, how can you possibly measure impact?&lt;/p&gt;
&lt;p&gt;Docs.&lt;/p&gt;
&lt;p&gt;Endless docs.&lt;/p&gt;
&lt;p&gt;Countless docs.&lt;/p&gt;
&lt;p&gt;So many docs that it can be impossible to find what doc says what you did.&lt;/p&gt;
&lt;p&gt;Google&#39;s mission is to &amp;quot;organize the world&#39;s information.&amp;quot; Internally in Google, they generate a lot of information in docs, and it&#39;s very hard to search and find the information you&#39;re looking for.&lt;/p&gt;
&lt;p&gt;What&#39;s the point of docs no one reads? Well, since software doesn&#39;t get shipped, I assume it just acts as a laundry list of links when attempting to show impact for your performance reviews or promotions. You might not have shipped anything, but at least you left a paper trail of what you didn&#39;t ship.&lt;/p&gt;
&lt;p&gt;You want to know the worst part of it? They want you to write a doc on a system you don&#39;t understand. So you write it up, make some assumptions and send it out for approval. No one reads it to approve it. Let&#39;s say you get your single approver and start implementing. Guess what, your core assumption is wrong. The data isn&#39;t in the right place, or the data you thought had what you needed, doesn&#39;t. Now you need to rewrite the doc.&lt;/p&gt;
&lt;p&gt;What&#39;s the point of getting approval? What&#39;s the point of a doc that is wrong from the start? What&#39;s the point of upfront design that is wrong? Why not just implement and find out what actually is going on and make it work?&lt;/p&gt;
&lt;p&gt;The point is, it&#39;s just theater to make it look like we&#39;re doing our jobs. Why isn&#39;t the software the evidence we&#39;re doing our job?&lt;/p&gt;
&lt;p&gt;I&#39;m not trying to say docs are bad, and everything should just be tribal knowledge. But I am saying docs that need to be rewritten from the get-go are a waste of time.&lt;/p&gt;
&lt;h3 id=&quot;bad-docs&quot;&gt;Bad docs&lt;/h3&gt;
&lt;p&gt;Ironically, despite needing to write so many docs to implement things. When you read other people&#39;s docs, you might notice something. They&#39;re very high-level. They&#39;re more like a thesis, then like actual documentation on how to use an API.&lt;/p&gt;
&lt;p&gt;What is the point of docs that don&#39;t answer how to use an API?&lt;/p&gt;
&lt;p&gt;Focusing on the high-level philosophy of a service is honestly distracting and unhelpful. I think I understand why this happens. It&#39;s hard to keep docs up to date. So if you keep them high-level, they won&#39;t become obsolete or need to be updated. But I don&#39;t care about your thesis defense; I just want to use your software to solve my problem.&lt;/p&gt;
&lt;p&gt;And I know Google can write good docs. &lt;a href=&quot;https://angular.dev/overview&quot;&gt;Angular&lt;/a&gt; has fantastic documentation. &lt;a href=&quot;https://protobuf.dev/overview/&quot;&gt;Proto Buffers&lt;/a&gt; have great docs. Both of these are made by Google. I guess the difference is they&#39;re public facing and Google doesn&#39;t prioritize internal docs like they do their external facing ones.&lt;/p&gt;
&lt;h2 id=&quot;a-culture-of-silence&quot;&gt;A Culture of Silence&lt;/h2&gt;
&lt;p&gt;So, there is a lot of lip service towards how open Google is. Say how they&#39;re trying to encourage employees in fireside chats to not ask anonymous questions so that leadership can follow up with the individual to gain more context. (This, by the way, does not prevent people from asking anonymously, which they do.)&lt;/p&gt;
&lt;p&gt;There is also a culture of no-blame retrospectives. They don&#39;t run regularly, even when I advocate for them. And worst of all, when we finally do run retrospectives, we don&#39;t discuss challenges and problems we are encountering. So, what&#39;s the point of a retrospective that doesn&#39;t talk about pain points and mitigation strategies? From my perspective, it just looks like theater and a way to paint a false view that everything is good and we have nothing to complain about. Or worse, that we are helpless and we really cannot change anything.&lt;/p&gt;
&lt;p&gt;Coming from companies with genuinely open cultures where we fostered candid and open discussions, it&#39;s baffling to me that no one seems willing to put in the minimal effort to improve everyone&#39;s lives.&lt;/p&gt;
&lt;p&gt;It is better to be positive about a broken system and keep the status quo than it is to ask people to put in a laughable small level of effort to make everyone&#39;s life better. Not everything is going smoothly all the time. And assuming we &lt;strong&gt;want&lt;/strong&gt; it to run smoothly, we should probably discuss the pain points and workarounds or solutions to them. Knowledge silos are bad. More open discussions can reduce knowledge silos which reduces the burden on individuals and gives everyone a balance for job responsibilities.&lt;/p&gt;
&lt;h2 id=&quot;a-culture-of-bottom-up-but-only-if-its-top-down&quot;&gt;A Culture of Bottom-Up (but only if it&#39;s top-down)&lt;/h2&gt;
&lt;p&gt;So, in meetings with leadership. They emphasize that our &lt;em&gt;bottom-up culture&lt;/em&gt; is how we do such great work. And by &lt;em&gt;bottom-up&lt;/em&gt;, they apparently mean &lt;em&gt;top-down&lt;/em&gt;.&lt;/p&gt;
&lt;h3 id=&quot;when-bottom-up-meets-brick-wall&quot;&gt;When Bottom-Up Meets Brick Wall&lt;/h3&gt;
&lt;p&gt;So, let&#39;s say our UXR (user experience research team) has come up with an obvious gap in our offerings. What would you do? Perhaps gather some people from multiple disciplines and brainstorm a solution. Or maybe you just get leadership and design in a room and iterate on who knows what behind closed doors for literal months, before you ever even involve engineering. And for those few months, you pull engineering off their current teams in a large-scale reorg and don&#39;t give them marching orders instead just give them a bunch of vague ideas of what they might want to build. Like...what is engineering supposed to do? Build against an invisible moving target? The answer is, that is exactly what we do. Not because it&#39;s a good use of our time, but because we have nothing better to do and we have no input into the vision of the product.&lt;/p&gt;
&lt;p&gt;So let&#39;s say, you&#39;re an engineer, like yours truly, and you think that process is stupid, and instead you really do want to try to implement a bottoms up initiative. So maybe, see a feature, we originally spec&#39;d out but was dropped because they didn&#39;t see the current value in implementing it. But it sounds kind of cool, and shouldn&#39;t be that difficult to get an MVP for this feature. Maybe you go to reach out across teams, pull in people that own data you need, a team that works on Android and iOS, and try to get people from the backend team so you can make an e2e MVP to demonstrate this feature is doable. Also, act as a test bed to show smaller agile processes work and probably how we should handle work in the org.&lt;/p&gt;
&lt;p&gt;Sounds pretty encouraging, right? But here is the real problem, one of the teams is a no-show. Not only are they a no-show, they also refuse to work with you and ignore your messages. You escalate to your manager and tech lead, and that team also ignores them too. You work with the other teams and implement everything, but say the one thing to tie everything together and make it work e2e. Let&#39;s say a backend team refused to work with you. So, naturally, offer to do the work for them. And they tell you to not do that. Because it&#39;s not my code base, I&#39;m not on call, and I don&#39;t have to maintain it. So what do you do?&lt;/p&gt;
&lt;p&gt;What I did was create a video demo that made it look like it should work and presented it to leadership. We were reorged before this demo was even presented, so the feature died on the vine.&lt;/p&gt;
&lt;h3 id=&quot;the-only-mvp-is-minimum-viable-plausible-deniability&quot;&gt;The Only MVP Is Minimum Viable Plausible Deniability&lt;/h3&gt;
&lt;p&gt;Let&#39;s say that you do still believe in the rhetoric that, &lt;em&gt;the organization really does believe in bottom-up&lt;/em&gt;. So you take some time and write up a doc (which is an activity you don&#39;t enjoy but if that&#39;s how the game is played, and you want to play ball, you do it). The doc outlines an open source initiative that is coincidentally attempting to solve the space we just tried to fill. But since there&#39;s an open-source community trying to solve the same problem space, maybe we can just leverage that and even help them grow at the same time. Anyway, it was super nice to have leadership hear me out, but they didn&#39;t want to go with it, because it turns out that one of the reasons we hamstrung our last project was because we were attempting to skirt a legal definition that the open source project is tackling head on. Suddenly, it made more sense: The original project was destined to fail, not because it was a bad idea, but because they were trying to handicap the implementation to avoid legal scrutiny.&lt;/p&gt;
&lt;p&gt;Fundamentally, we&#39;re not trying to build good software or solve problems. We&#39;re just trying to do something without bringing legal scrutiny to Google.&lt;/p&gt;
&lt;p&gt;I understand getting sued sucks, and the law is often weaponized against Google. But why handicap ourselves? There are so many other ideas out there. Why not pursue things that are higher value and lower risk? I cynically believe it could just be virtue signaling to investors, to show Google is trying new things and still taking risks. But their risks seem high-risk, low-reward, compared to the normal practices I&#39;m used to, which focus on mitigating risk and prioritizing high value. Taking risks here seems to be about signaling growth, but are they truly growing? Wouldn&#39;t the more obvious path be to take the calculated legal risk to solve a real problem and potentially achieve genuine growth? I don&#39;t know; I&#39;m not in leadership. I just had a worm&#39;s-eye view of the machine.&lt;/p&gt;
&lt;h3 id=&quot;grassroots-agility-stomped-by-apathy&quot;&gt;Grassroots Agility, Stomped by Apathy&lt;/h3&gt;
&lt;p&gt;Let&#39;s say you came from an agile background and you even believe it. Because you&#39;ve seen it solve very obvious communication issues that you see arise in large organizations. You&#39;ve experienced it firsthand, you know it works. You go and explain it to your manager, they say that there are organization issues and leadership is resistant to change. They don&#39;t discourage you from trying, but they kind of set the expectations that nothing will change. But, what else are you supposed to do? Nothing?&lt;/p&gt;
&lt;p&gt;So you have a meeting with your skip manager (your manager&#39;s manager) once again advocating to adopt agile processes and maybe get more stakeholder buy-in. And they give you the advice to do it locally with your team. You know, &amp;quot;bottom-up&amp;quot; kind of stuff.&lt;/p&gt;
&lt;p&gt;You present it to the team. They hate it. They don&#39;t want processes. They don&#39;t want collaboration or more communication. They say agile practices are dehumanizing and that we are not interchangeable cogs in the machine. A bit of a disservice towards agile processes. But they are willing to try some of the ceremonies.&lt;/p&gt;
&lt;p&gt;But literally, for any reason whatsoever, they cancel meetings, like retrospectives or stand-ups. Maybe we need more time to finish a feature, or maybe it&#39;s a holiday, or we get reorged. And we never start up the meeting again, at least until I ask for it. Followed by it once again being canceled at the drop of a hat. And no one cares. They don&#39;t see the value in it. And to be honest, the ceremonies are toothless because we don&#39;t discuss actual problems, we don&#39;t discuss work progress to reduce knowledge silos, and action items are never done and are also usually not meaningful anyway.&lt;/p&gt;
&lt;p&gt;The reason people don&#39;t see the value of agile processes is not that it&#39;s not a good framework to address communication gaps, but because just doing the ceremonies without the communication makes them pointless. There is value in the ceremonies if they&#39;re being used to address the problems. But actively ignoring the problems, even with ceremonies, means we&#39;re now just wasting people&#39;s time.&lt;/p&gt;
&lt;h3 id=&quot;bottom-up-top-down-and-going-nowhere&quot;&gt;Bottom-Up, Top-Down, and Going Nowhere&lt;/h3&gt;
&lt;p&gt;If there is a bottom-up culture at Google, it is self sabotaging. There is so much momentum for the status quo that actual process change is near impossible. The only change that appears to work is a top-down mandate, which they try every year with constant reorgs and get the same results.&lt;/p&gt;
&lt;h2 id=&quot;there-is-no-team-in-i&quot;&gt;There is No Team in I&lt;/h2&gt;
&lt;p&gt;So, coming from an agile background (I know I sound like I&#39;m in a cult, with how much I bring it up, but bear with me), I&#39;ve come to the understanding that I as an individual do not necessarily matter. It&#39;s about putting aside ego and working together on a larger goal. This also comes with a nice benefit of distributing responsibility, and reducing burn out.&lt;/p&gt;
&lt;p&gt;That&#39;s pretty damn &lt;em&gt;ungoogley&lt;/em&gt;. At Google, they&#39;re rugged cowboys. They pull themselves up by the bootstrap and don&#39;t care about your collaboration. You need to own everything. Your work, your feature, your project, your process, your career. No one is here to help you. You need to just do it yourself. Which is ironic, as &lt;a href=&quot;https://staffeng.medium.com/being-googly-62b75dd642df&quot;&gt;googley-ness&lt;/a&gt; should theoretically not embody it. But the performance evaluation surely doesn&#39;t emphasize trying to make teamwork work.&lt;/p&gt;
&lt;p&gt;&lt;a href=&quot;https://en.wikipedia.org/wiki/Bus_factor&quot;&gt;A bus factor&lt;/a&gt; of 1 is seen as a positive thing. It means you&#39;ve made yourself invaluable. You are the sole point of contact, and despite that sounding like a lot of annoying responsibility, it&#39;s perceived as good because you &lt;em&gt;own&lt;/em&gt; it.&lt;/p&gt;
&lt;p&gt;I hate knowledge silos. I do not believe it makes anyone more valuable. I fought against the hoarding of knowledge. I&#39;d include people into meetings to make sure I&#39;m not the only one with context. I&#39;d ask stupid questions and repeat talking points in meetings to make sure I understood and we were aligned. These are all considered negative things at Google. Because it is seen as wasting everyone&#39;s time in the meeting. It is better to repeat yourself with several dozen 1:1s (or I guess write yet another doc no one will read) than it is to talk it over in a group and make sure there is no ambiguity.&lt;/p&gt;
&lt;p&gt;It could just be me though. But it sure felt like it, when my manager said I was &lt;em&gt;&amp;quot;leaning on others too much.&amp;quot;&lt;/em&gt; How else am I supposed to read that?&lt;/p&gt;
&lt;p&gt;I&#39;ve never seen such an environment that is literally so hostile to collaboration.&lt;/p&gt;
&lt;h2 id=&quot;performative-theater&quot;&gt;Performative Theater&lt;/h2&gt;
&lt;p&gt;I hate 1:1s. I think they&#39;re a waste of time. I would even argue that most 1:1s are a waste of time in every context. I&#39;m probably being hyperbolic, as I&#39;m sure there must be cases where 1:1s are beneficial. But I&#39;m struggling to think of one right now.&lt;/p&gt;
&lt;p&gt;1:1s are a bottleneck to communication. And judging by how often my 1:1s were canceled with my managers, I&#39;d have to say they don&#39;t value them either.&lt;/p&gt;
&lt;p&gt;So, I&#39;m a huge advocate for openness and transparency. And after one reorg (I went through 5 reorgs in my 4 years at Google, and been through 7 managers, chaos is the norm) leadership was attempting to be more open and transparent and so allowed anyone to join their meetings. So, since I felt like I did not have enough context to understand their decisions, I joined those meetings.&lt;/p&gt;
&lt;p&gt;When they asked if everyone had context on a doc, I was the only person to raise my hand and said I did not. I guess this was a sin to acknowledge my own ignorance, because it turns out after the next meetings I was removed from the subsequent meetings. I asked my manager if I could be brought back to gain more context, and he told me I had enough context to do my job. While probably true, I had a suspicion that my work was not very high priority. Maybe we should work on something else. Anyway, this taught me that it&#39;s all optics. I think my manager wanted to control the narrative. If he wasn&#39;t there to be a middle man, what is his job? Like, seriously, what &lt;em&gt;is&lt;/em&gt; his job? I still don&#39;t understand what value he brought.&lt;/p&gt;
&lt;h2 id=&quot;tech-debt-forever&quot;&gt;Tech Debt Forever&lt;/h2&gt;
&lt;p&gt;To say Google&#39;s code base is complex is an understatement. Not only is it complicated, it&#39;s also a mess. Not only is it a mess, but it&#39;s also poorly documented. And not only that, but it actively fights you as you make changes and try to understand it.&lt;/p&gt;
&lt;p&gt;Cryptic compile errors. Cryptic build errors. Cryptic run time errors. And just when you think you&#39;ve finally got it working. There are blockers on merging the code because of invisible linting errors you didn&#39;t know you were violating. Or there is some weird test case that broke, but only after 3 hours of running tests in the CI pipeline. Or maybe, you just want to delete some code, but it turns out that the code you&#39;re trying to delete has a different release schedule, so it cannot be deleted with other code. And the other code is dependent on the first bit of code that you cannot delete being deleted. The code is constantly fighting you. And maybe if we could discuss these issues in a group, we could understand the problems quicker or come up with strategies to mitigate them...but it turns out talking about how much it sucks to write code is frowned upon. So you just need to keep it to yourself. And I&#39;m left wondering, &lt;em&gt;am I the problem?&lt;/em&gt; Is my career a lie? Do I have imposter syndrome if I don&#39;t actually know what I&#39;m doing? It makes you question everything.&lt;/p&gt;
&lt;p&gt;So I talked with my director (the skip’s manager) about my challenges. And I was candid about it. And he said, &amp;quot;It sounds like you need mentorship.&amp;quot; And I said, that&#39;s exactly what I need. And he said he&#39;d help get me some. I messaged him every week for a few months. He offloaded this responsibility to my manager, who naturally, did nothing. By the time I left, I made the request 8 months prior. I was clearly not getting the mentorship I asked for. My manager&#39;s &lt;em&gt;wonderful&lt;/em&gt; feedback was, &amp;quot;maybe you should find your own mentorship.&amp;quot; And it does make me wonder, &amp;quot;what is &lt;em&gt;your&lt;/em&gt; job if it is not to help me do &lt;em&gt;my&lt;/em&gt; job better?&amp;quot; Anyway, I also was unable to find mentorship on my own. And it does make me wonder, does anyone truly understand the beast that is Google&#39;s complex internally built tech stack with poor documentation? Even the internal AI that is usually pretty good at explaining some of the code, will just straight-up hallucinate how the code works and then it becomes very hard to understand. The AI will tell you a very convincing lie, but you won&#39;t know it&#39;s a hallucination or how to possibly fix it, because the documentation is poor and the only way to learn how it really works is to reverse-engineer it by performing code archaeology.&lt;/p&gt;
&lt;h2 id=&quot;i-m-out&quot;&gt;I&#39;m out&lt;/h2&gt;
&lt;p&gt;So I left Google. It was amicable. This was, of course, also only my personal experience in my particular organization. I&#39;ve been told different parts of the org and different teams are said to have different cultures. Heck, even some people might even thrive in the culture I described. But it&#39;s not for me.&lt;/p&gt;
&lt;p&gt;They gave me severance, which was honestly extremely nice. I tried so hard to bring cultural change to Google, but there is no willingness to change. Honestly, with the amount of money they&#39;re printing with ads and search, there is no pressure for them to make any changes.&lt;/p&gt;
&lt;p&gt;There is a clear cultural mismatch between what I value and what Google values. Even if Google pays lip service that they value the same things I value, their actions clearly show they do not. And so, I am honestly happy to be free from them and given the time to look for a place that values what I want.&lt;/p&gt;
&lt;p&gt;I used to believe I was &lt;em&gt;a mercenary for hire to the highest bidder&lt;/em&gt;. But you know what? Apparently, within reason. I just want to work, collaborate, and iterate on software. Is that asking for too much? The one thing I can take away from my time at Google is that I now have a clearer understanding of what I&#39;m looking for in my next step.&lt;/p&gt;
</content>
    </entry>
    <entry>
        <title>Outdated JSX Transform in NextJS Tests.</title>
        <link href="https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/" />
        <updated>2025-02-28T00:00:00Z</updated>
        <id>https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/</id>
        <content type="html">&lt;p&gt;A little while ago I upgraded React to v19 in &lt;a href=&quot;https://github.com/HeyOmae/OMA3&quot;&gt;OMA3&lt;/a&gt; and I started to see this warning pop up in my terminal when I ran my tests.&lt;/p&gt;
&lt;p&gt;&lt;picture&gt;&lt;source type=&quot;image/avif&quot; srcset=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/PIwMR5_r4R-1394.avif 1394w&quot;&gt;&lt;source type=&quot;image/webp&quot; srcset=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/PIwMR5_r4R-1394.webp 1394w&quot;&gt;&lt;img loading=&quot;lazy&quot; decoding=&quot;async&quot; src=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/PIwMR5_r4R-1394.png&quot; alt=&quot;Terminal Message that reads, &quot; width=&quot;1394&quot; height=&quot;118&quot;&gt;&lt;/picture&gt;&lt;/p&gt;
&lt;p&gt;Like any developer, I completely ignored it, knowing that warning are more like suggestions than like mandates. But it still annoyed me to see that pop up in every test. So I decided that I was going to solve it. And so I wasted about a week to track down what the problem was.&lt;/p&gt;
&lt;p&gt;I originally just stumbled around trying to understand what was going on. I of course started with the official docs, as they published &lt;a href=&quot;https://react.dev/blog/2024/04/25/react-19-upgrade-guide&quot;&gt;an upgrade guide&lt;/a&gt;. And there it was as plain as day in the &lt;a href=&quot;https://react.dev/blog/2024/04/25/react-19-upgrade-guide#installing&quot;&gt;Installing section&lt;/a&gt;.&lt;/p&gt;
&lt;blockquote&gt;
&lt;p&gt;New JSX Transform is now required&lt;/p&gt;
&lt;/blockquote&gt;
&lt;p&gt;Anyway, &lt;a href=&quot;https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html&quot;&gt;the announcement doc from 2020&lt;/a&gt; was not helpful in debugging the problem as they said &lt;a href=&quot;https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#nextjs&quot;&gt;NextJS over 9.5.3&lt;/a&gt; should support this. And OMA3 is currently on 15.2.0.&lt;/p&gt;
&lt;p&gt;I double checked the .babelrc, and my jest config. And they appeared to be correct.&lt;/p&gt;
&lt;p&gt;I tried to Google for the answers but oddly didn&#39;t see anyone else with this problem (at least in their test files only). I asked Gemini and ChatGPT, and they gave me incredibly misleading hints that did nothing.&lt;/p&gt;
&lt;p&gt;Anyway, ChatGPT did give me one hint that was a helpful clue to debug the situation.&lt;/p&gt;
&lt;p&gt;It told me to run&lt;/p&gt;
&lt;pre&gt;&lt;code&gt;BABEL_SHOW_CONFIG_FOR=./path/to/someJSfile.js jest --clearCache
&lt;/code&gt;&lt;/pre&gt;
&lt;p&gt;I modified it a bit to look like this.&lt;/p&gt;
&lt;pre&gt;&lt;code&gt;BABEL_SHOW_CONFIG_FOR=./components/runner/CharacterSheet/CharacterSheet.test.tsx npm run test
&lt;/code&gt;&lt;/pre&gt;
&lt;p&gt;Which ended up running ALL of my tests, but did print out the babel config. Which did not help me. Everything looked like it was configured correctly. But I did see this&lt;/p&gt;
&lt;pre&gt;&lt;code&gt;  &amp;quot;presets&amp;quot;: [
    &amp;quot;next/babel&amp;quot;,
    &amp;quot;node_modules/babel-preset-jest/index.js&amp;quot;
  ]
&lt;/code&gt;&lt;/pre&gt;
&lt;p&gt;What if the problem was in babel-preset-jest? It wasn&#39;t...I&#39;ll cut to the chase, the problem was in &lt;code&gt;next/babel&lt;/code&gt;.&lt;/p&gt;
&lt;p&gt;You can see &lt;a href=&quot;https://github.com/vercel/next.js/blob/canary/packages/next/src/build/babel/preset.ts#L86C1-L89C54&quot;&gt;here&lt;/a&gt;&lt;/p&gt;
&lt;pre&gt;&lt;code&gt;  const useJsxRuntime =
    options[&#39;preset-react&#39;]?.runtime === &#39;automatic&#39; ||
    (Boolean(api.caller((caller: any) =&amp;gt; !!caller &amp;amp;&amp;amp; caller.hasJsxRuntime)) &amp;amp;&amp;amp;
      options[&#39;preset-react&#39;]?.runtime !== &#39;classic&#39;)
&lt;/code&gt;&lt;/pre&gt;
&lt;p&gt;This controls if the new JSX transform is used. And in &lt;code&gt;babel-jest&lt;/code&gt; the runtime isn&#39;t set and the &lt;code&gt;hasJsxRuntime&lt;/code&gt; is also not set. So the JSX transform falls back to classic.&lt;/p&gt;
&lt;h2 id=&quot;solution&quot;&gt;Solution&lt;/h2&gt;
&lt;p&gt;There are 2 options.&lt;/p&gt;
&lt;h3 id=&quot;option-1&quot;&gt;Option 1&lt;/h3&gt;
&lt;p&gt;Add &lt;code&gt;runtime: &amp;quot;automatic&amp;quot;&lt;/code&gt; to the .babelrc&lt;/p&gt;
&lt;pre&gt;&lt;code&gt;{
  &amp;quot;presets&amp;quot;: [
    [&amp;quot;next/babel&amp;quot;, {
      &amp;quot;preset-react&amp;quot;: {
        &amp;quot;runtime&amp;quot;: &amp;quot;automatic&amp;quot;
      }
    }]
  ]
}
&lt;/code&gt;&lt;/pre&gt;
&lt;h3 id=&quot;option-2&quot;&gt;Option 2&lt;/h3&gt;
&lt;p&gt;Add &lt;code&gt;hasJsxRuntime&lt;/code&gt; to the &lt;code&gt;caller&lt;/code&gt; for &lt;code&gt;babel-jest&lt;/code&gt;&lt;/p&gt;
&lt;pre&gt;&lt;code&gt;...
  transform: {
    &amp;quot;^.+&#92;&#92;.(ts|tsx)$&amp;quot;: [
      &amp;quot;babel-jest&amp;quot;,
      {
        configFile: &amp;quot;./.babelrc&amp;quot;,
        caller: {
          name: &amp;quot;babel-jest&amp;quot;,
          hasJsxRuntime: true,
        },
      },
    ],
  },
...
&lt;/code&gt;&lt;/pre&gt;
&lt;h2 id=&quot;conclusion&quot;&gt;Conclusion&lt;/h2&gt;
&lt;p&gt;I opted for Option 2, because it felt more pure to me since the build was already working as intended.&lt;/p&gt;
&lt;p&gt;And after the fix the warning went away and I saw almost no difference in the speed that the tests. But I still feel good that I killed the warning message at least.&lt;/p&gt;
&lt;h3 id=&quot;before&quot;&gt;Before&lt;/h3&gt;
&lt;p&gt;&lt;picture&gt;&lt;source type=&quot;image/avif&quot; srcset=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/lWFJiDUR83-484.avif 484w&quot;&gt;&lt;source type=&quot;image/webp&quot; srcset=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/lWFJiDUR83-484.webp 484w&quot;&gt;&lt;img loading=&quot;lazy&quot; decoding=&quot;async&quot; src=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/lWFJiDUR83-484.png&quot; alt=&quot;Tests ran in 50 seconds&quot; width=&quot;484&quot; height=&quot;142&quot;&gt;&lt;/picture&gt;&lt;/p&gt;
&lt;h3 id=&quot;after&quot;&gt;After&lt;/h3&gt;
&lt;p&gt;&lt;picture&gt;&lt;source type=&quot;image/avif&quot; srcset=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/LhGmBauul9-480.avif 480w&quot;&gt;&lt;source type=&quot;image/webp&quot; srcset=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/LhGmBauul9-480.webp 480w&quot;&gt;&lt;img loading=&quot;lazy&quot; decoding=&quot;async&quot; src=&quot;https://example.com/blog/20250228-outdated-jsx-transform-in-nextjs-tests/LhGmBauul9-480.png&quot; alt=&quot;Tests ran in 48 seconds&quot; width=&quot;480&quot; height=&quot;130&quot;&gt;&lt;/picture&gt;&lt;/p&gt;
</content>
    </entry>
    <entry>
        <title>10 Things I wish I knew when I started Software Engineering.</title>
        <link href="https://example.com/blog/20250118-10-things-i-wish-i-knew/" />
        <updated>2025-01-18T00:00:00Z</updated>
        <id>https://example.com/blog/20250118-10-things-i-wish-i-knew/</id>
        <content type="html">&lt;p&gt;Full disclosure: this is not actually good advice that&#39;d have helped me that much early in my career. But these kind of click bait titles seem to get people to take notice.&lt;/p&gt;
&lt;p&gt;So, I&#39;ve been doing this software thing for a little while now (13 years, I guess?). So with the awesome power of hindsight, let me give you some sagely advice in one of them listicles that the Google algorithm likes to rank high on the results page. This is some relatively generic advice I&#39;ve picked up over the years, but I&#39;ve found it to hold pretty true.&lt;/p&gt;
&lt;h2 id=&quot;1-just-look-at-the-damn-answer&quot;&gt;1. Just look at the damn answer&lt;/h2&gt;
&lt;p&gt;So when I started to learn Javascript, I tried to use working through the coding problems in &lt;a href=&quot;https://eloquentjavascript.net/&quot;&gt;Eloquent Javascript&lt;/a&gt; (it was the 3rd edition at the time) but I was a complete newbie. I didn&#39;t know browser APIs (I used jQuery that abstracted all that way from me at the time), let alone I just barely knew the syntax on how to write basic JS.&lt;/p&gt;
&lt;p&gt;Anyway, at some point in time, I gave up and just looked at the answer and I was able to learn and level up much faster.&lt;/p&gt;
&lt;p&gt;Same thing when I started leet coding. I was able to brute force with the best of them. But actually coming up with a solution that wouldn&#39;t stack overflow on the more complex problems. Forget about it.&lt;/p&gt;
&lt;p&gt;So to learn those more advance concepts like sliding window, making a hashmap, or whatever. These things are not intuitive and it&#39;s not easy to recognize when you need them. So just look up the answer and come back tomorrow and see if you can&#39;t implement it from memory. And come back a week later and try it again. The only way to commit something to memory is through repetition. Practice makes perfect, so you might as well get in to the habit of doing this stuff over and over again.&lt;/p&gt;
&lt;h2 id=&quot;2-time-box-the-pain&quot;&gt;2. Time box the pain&lt;/h2&gt;
&lt;p&gt;Going back to #1, I am not a genius. If something is hard for you now. Rage quit it and try something else, or just revisit a problem later.&lt;/p&gt;
&lt;p&gt;As a real world example, &lt;a href=&quot;https://oma3.vercel.app/&quot;&gt;OMA3&lt;/a&gt; for a VERY long time had a 404 problem if you tried to refresh the site on anything other than the home page. I created &lt;a href=&quot;https://github.com/vercel/next.js/discussions/21235&quot;&gt;this discussion&lt;/a&gt; in 2021 and found the solution for it in 2024 while trying to fix an unrelated problem. I spent a large amount of time trying to solve this issue. I knew it was some kind of configuration issue, I assumed it was a problem on the vercel side, since it worked as intended locally. And it technically was. But trying to find which thing was causing it was not a trivial matter since my set up was a bit unconventional.&lt;/p&gt;
&lt;p&gt;Going back to leetcode, if you can&#39;t solve a problem in 30 minutes, or you quite literally have no concept what to do. Just look up the answer. Ain&#39;t nobody going to hold it against a newbie not knowing the answer.&lt;/p&gt;
&lt;p&gt;Learning from others is quite literally one of the most powerful tools humanity has. So take advantage of it. Ask for help from those who are more experienced than yourself. Look up solutions on how other&#39;s solved programming problems. Don&#39;t try and be original and novel.&lt;/p&gt;
&lt;blockquote&gt;
&lt;p&gt;What has been will be again, what has been done will be done again; there is nothing new under the sun.
--Batman (Probably)&lt;/p&gt;
&lt;/blockquote&gt;
&lt;p&gt;This holds pretty true for programming too.&lt;/p&gt;
&lt;h2 id=&quot;3-ask-for-help&quot;&gt;3. Ask for help&lt;/h2&gt;
&lt;p&gt;You need to struggle a bit on your own. At least do your due diligence and see if you can&#39;t find a solution from documentation or other resources. But at the same time, looking for a solution can be a endless rabbit hole that you think you&#39;re almost at the solution, a kind of gambler&#39;s fallacy.&lt;/p&gt;
&lt;p&gt;So go back to #2, time box the pain. If you&#39;ve wasted more then 2 hours on a problem, you&#39;re probably not finding the solution in the 3rd or 4th hour. So you might as well ask for help. If you&#39;re using asynchronous communication, fire off a message and go back to researching a solution while you wait for your colleague/mentor/maintainer/hivemind to get back to you.&lt;/p&gt;
&lt;p&gt;Also, try to document a solution in a way that it can be found by others. You might be unwittingly helping future other people with the same problem. So other forums, like stackoverflow, github discussions/issues, or reddit is preferred something closed wall gardens like discord or slack. It is better to embarrass yourself in public to help a future stranger than it is to silo knowledge.&lt;/p&gt;
&lt;p&gt;Death to the wall gardens! Long live the open (and indexable) open web!&lt;/p&gt;
&lt;h2 id=&quot;4-dont-copy-and-paste&quot;&gt;4. Don&#39;t copy and paste&lt;/h2&gt;
&lt;p&gt;You find a solution, or following a tutorial. Don&#39;t copy and paste a solution. Type it out. Force yourself to build up the muscle memory and also forces you to &lt;em&gt;read&lt;/em&gt; the code (and hopefully understand it). It&#39;s slower and more annoying. But when learning you&#39;re not in a race to the end. It&#39;s a marathon of repetition to incorporate it in to the ol&#39; grey matter.&lt;/p&gt;
&lt;h2 id=&quot;5-learn-how-to-write-tests-first&quot;&gt;5. Learn how to write tests first&lt;/h2&gt;
&lt;p&gt;Test driven development is the concept of writing a test before you write the implementation.&lt;/p&gt;
&lt;p&gt;In theory you should already know what you need to happen. So you should be able to write a test that looks for what you expect to happen.&lt;/p&gt;
&lt;p&gt;In reality, there is a somewhat nightmarish amount of complexity and things that can go wrong. But if you can learn the basics of how to write what you are expecting to happen first, then write the implementation you&#39;ll be able to take a lot of mental load off your mind. Also tests act as living documentation for a project. Assuming you have a CI/CD pipeline, it should run tests before deploying and notify you if a tests breaks (and also not deploy). If you need to onboard someone you can just tell them to look at the tests to figure out what the software does. It&#39;s a win/win situation.&lt;/p&gt;
&lt;p&gt;Unless tests are flaky...that&#39;s a kind of special hell. Usually it&#39;s because you wrote the test wrong, and learning how to write tests right is sometimes a real pain in the ass. But it&#39;s still worth it for the long term benefits of testing.&lt;/p&gt;
&lt;p&gt;Maybe I&#39;ll write another blog post going over my philosophy of testing and some examples.&lt;/p&gt;
&lt;h2 id=&quot;6-make-a-cool-hobby-app&quot;&gt;6. Make a cool hobby app&lt;/h2&gt;
&lt;p&gt;Work, or at least my work, is often boring and not creative. It&#39;s not like it&#39;s not interesting, because in someways it is else I&#39;d have a real hard time getting out of bed to make websites for people. But where I feel like I can really solve real interesting problems is in hobby apps. I also get to experiment with new technologies, try new programming patterns, play with new frameworks and libraries, experiment with best practices, and throw caution to the wind.&lt;/p&gt;
&lt;p&gt;I&#39;ve build and rebuild an app to create Shadowrun characters for basically my entire career. One of the &lt;a href=&quot;https://github.com/HeyOmae/Omae&quot;&gt;first version&lt;/a&gt; I did, back at the dawn of time, was make a character generator using jQuery. The &lt;a href=&quot;https://github.com/dethstrobe/omae2&quot;&gt;second one&lt;/a&gt;, I attempted to build it with angularjs. The &lt;a href=&quot;https://github.com/HeyOmae/Omae2.1&quot;&gt;actual second attempt (v2.1)&lt;/a&gt; was built using React and Redux. And the &lt;a href=&quot;https://github.com/HeyOmae/OMA3&quot;&gt;newest one&lt;/a&gt; is built using NextJS.&lt;/p&gt;
&lt;p&gt;Each time I take what I&#39;ve learned and I try to experiment to try new things to learn more. Anyway, think of a problem and make an app to solve it. It&#39;s a great way to learn and do cool stuff.&lt;/p&gt;
&lt;h2 id=&quot;7-hard-problems-are-just-a-lot-of-small-problems&quot;&gt;7. Hard problems are just a lot of small problems&lt;/h2&gt;
&lt;p&gt;I am a huge advocate for Agile software development. A lot of people follow scrum methodology and do the scrum ceremonies. But that&#39;s not necessarily what makes agile processes work.&lt;/p&gt;
&lt;p&gt;The point of agile methodologies is to break big problems into small problems and ship it and get feedback if you&#39;re even building the right thing. And if it looks good, then you &lt;a href=&quot;https://en.wikipedia.org/wiki/Kaizen&quot;&gt;kaizen&lt;/a&gt;!&lt;/p&gt;
&lt;p&gt;Predicting the future is hard. So don&#39;t. Instead try and make small incremental changes that will hopefully get you where you want to go. But if you&#39;re wrong, you can pivot and hopefully not waste a lot of effort to make something worthwhile.&lt;/p&gt;
&lt;h2 id=&quot;8-software-is-made-of-softness&quot;&gt;8. Software is made of softness&lt;/h2&gt;
&lt;p&gt;Don&#39;t over think a solution. Just get something working. If you get it wrong, guess what, you can change it and make it better later. Software is super easy to make changes. Because if it wasn&#39;t, we&#39;d call it hardware engineering.&lt;/p&gt;
&lt;p&gt;This also gets to another point, if it is hard to change something in software, refactor it to make it easier. It is definitely an art to make modular software, but try to keep it in mind and you&#39;ll make your life easier.&lt;/p&gt;
&lt;p&gt;If you make your software modular you also make software easier to be discarded. Your code is trash, you just don&#39;t know it yet because you haven&#39;t learned a better way to do it. You&#39;re not at the pinnacle of your skill set, so you can always write better code. So try and make it easier on future you to be able to refactor, discard, or just swap out your current code.&lt;/p&gt;
&lt;h2 id=&quot;9-find-a-new-job-every-2-years&quot;&gt;9. Find a new job every 2 years&lt;/h2&gt;
&lt;p&gt;Jump ship early and often. Aim for a 20 to 30% raise every 2 years until you hit the market cap of your city, than move to a bigger city.&lt;/p&gt;
&lt;p&gt;Being exposed to more technology, frameworks, programming patterns, learning new ways to work, learning from others, even teaching others. There are so many benefits to jumping ship and you hurt your own personal growth and hold back your salary by staying at your current company.&lt;/p&gt;
&lt;h2 id=&quot;10-communication-is-key-talk-to-people-early-and-often&quot;&gt;10. Communication is key. Talk to people early and often.&lt;/h2&gt;
&lt;p&gt;Get feedback early and often, and give feedback early and often.&lt;/p&gt;
&lt;p&gt;Try to have quick and regular talks. I&#39;m personally a huge fan of adhoc conversations, but as I have learned at a larger companies sometimes you just need to set up meetings. Meetings are evil by the way and should be avoided at all cost. But...if it&#39;s the only way to get to talk to some people, then you got to do what you got to do, and make a meeting and add it to people&#39;s calendar that you need to talk with.&lt;/p&gt;
</content>
    </entry>
    <entry>
        <title>The Starting Point.</title>
        <link href="https://example.com/blog/firstpost/" />
        <updated>2025-01-05T00:00:00Z</updated>
        <id>https://example.com/blog/firstpost/</id>
        <content type="html">&lt;p&gt;First post setting up the blog.&lt;/p&gt;
&lt;p&gt;It&#39;s powered by Eleventy because I didn&#39;t need a non-static website, and I know enough about coding that using markdown instead of something like wordpress sounded cool to me.&lt;/p&gt;
&lt;p&gt;I&#39;m not quite clear what I&#39;m going to make of this site just yet. Maybe musing on agile software development, all the little random non-sense things I&#39;ve learned in my time in the tech space, maybe just random things that interest me, or maybe just a place to talk about myself and my journey on how I got here.&lt;/p&gt;
&lt;p&gt;I think it&#39;d be kind of cool to make a slight game out of this site, but I&#39;m not clear what that&#39;d be. I guess it could also be a demo site and a place to host all my little front end experiments over the years.&lt;/p&gt;
&lt;p&gt;Anyway, hopefully I got a bit more time to figure out what to do with this.&lt;/p&gt;
</content>
    </entry>
</feed>`
