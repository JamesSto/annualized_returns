// import { useState } from 'react'
import "./App.css";
import { ASSETS } from "./utils/Constants";
import GrowthChart from "./components/GrowthChart";
import InteractiveGrowthChart from "./components/InteractiveGrowthChart";
import Tooltip from "./components/Tooltip";

import nytBefore from "./assets/nyt_before.png";
import nytAfter from "./assets/nyt_after.png";
import nerdwalletBefore from "./assets/nerdwallet_before.png";
import nerdwalletAfter from "./assets/nerdwallet_after.png";

function App() {
  return (
    <div>
      <header>
        <a href="/">Tinker Deck</a>
      </header>
      <main>
        <h1>
          Buying a Home is Probably Even Worse than the NYTimes/NerdWallet
          Calculators Imply
        </h1>{" "}
        <h4>
          <a href="#interactive-growth">
            Click to try the interactive growth explorer now
          </a>
        </h4>
        <p className="no-margin-bottom">
          Home price appreciation rates and cash investment appreciation rates
          are some of the most important inputs to rent vs buy calculators. Yet
          those calculators don't seem to have put a lot of thought into their
          defaults. They <em>seriously</em> understimate how much
          better of an investment stocks have been than homes historically.
          Small changes, or medium ones like the ones I'm suggesting, move the
          needle <em>a lot</em>. Here's how the topline changes if you adjust
          nothing other than these growth assumptions:
        </p>{" "}
        <div className="comparison-container">
          <div className="comparison-section">
            <div className="comparison-images">
              <div className="image-block">
                <h3>Before: New York Times</h3>
                <p>
                  Housing: 3%
                  <br />
                  Other Assets: 4.5%
                </p>
                <div className="image-with-arrow">
                  <img src={nytBefore} alt="NYT Calculator Before" />
                  <div className="arrow">→</div>
                </div>
              </div>
              <div className="image-block">
                <h3>After: New York Times</h3>
                <p>
                  Housing: 3.4%
                  <br />
                  Other Assets: 7.9%
                </p>
                <div className="image-with-arrow">
                  <img src={nytAfter} alt="NYT Calculator After" />
                </div>
              </div>
            </div>
          </div>

          <div className="comparison-section">
            <div className="comparison-images">
              <div className="image-block">
                <h3>Before: NerdWallet</h3>
                <p>
                  Housing: 4.5%
                  <br />
                  Other Assets: 6%
                </p>
                <div className="image-with-arrow">
                  <img
                    src={nerdwalletBefore}
                    alt="NerdWallet Calculator Before"
                  />
                  <div className="arrow">→</div>
                </div>
              </div>
              <div className="image-block">
                <h3>After: NerdWallet</h3>
                <p>
                  Housing: 3.4%
                  <br />
                  Other Assets: 7.9%
                </p>
                <div className="image-with-arrow">
                  <img
                    src={nerdwalletAfter}
                    alt="NerdWallet Calculator After"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          At the end of this post, you can find an{" "}
          <a href="#interactive-growth">interactive tool</a> where you can play
          with historical growth rates by yourself. Try it out! The road to any
          decision is paved with a million unchecked assumptions, so I hope you
          take some time to see if you agree with mine.
        </p>{" "}
        <p>
          For those unfamiliar, these rent/buy calculators attempt to estimate
          the cash flow over XX years for renting vs buying a home
          <Tooltip
            number={1}
            content="Of course, they can never tell you how much you should *value* buying a home over renting. 
            Each has *a lot* of non-financial implications, and only you can decide how much those are worth to you."
          />
          . For buying, this is the down payment, mortgage, taxes, etc, and then
          crucially selling the appreciated home after XX years
          <Tooltip
            number={2}
            content="Buying also has the large advantage of being a highly leveraged investment, which the tools also account for."
          />
          . For renting, this is mostly rent, but also crucially investment
          income from investing the money that would have gone into the
          mortgage/down payment. When I recalculate these numbers, all I'm doing
          is saying that the default home appreciation rate and the investment
          appreciation rate should be updated in the tool, and showing the
          result of that.
        </p>{" "}
        <h2>Where do the default numbers come from?</h2>{" "}
        <p>
          The awesome people at NerdWallet replied to my email, so we'll walk
          through their methodology step by step.
        </p>{" "}
        <blockquote>
          {" "}
          <p>
            <strong>Rate of Return (RoR):</strong> Our default of 6% is a
            conservative estimate based on{" "}
            <a href="https://www.nerdwallet.com/article/investing/average-stock-market-return">
              historic stock market returns
            </a>
            , which average 10%
            <Tooltip
              number={3}
              content="Neither tool states this explicitly, but they seem to be using nominal (not inflation adjusted) values, so that's the convention I'll follow."
            />
          </p>{" "}
        </blockquote>{" "}
        <p>
          Let's visualize this by showing a graph that we're going to work with
          a lot here. On the Y Axis – average S&amp;P 500 growth rate over a 20
          year period. On the X axis, we have the percentile – the percent of 20
          year periods since 1976 that achieved at most that annualized growth
          rate. For example, by looking at the 50th percentile on the X axis,
          you can see the median annualized growth of all 20 year periods since
          1976. As NerdWallet said, this is about 10%.
        </p>{" "}
        <div>
          <GrowthChart assets={[ASSETS.SP_500_INDEX]} periodSize={20} />
        </div>{" "}
        <p>
          Why 20 years? It's about how long I'd expect to stay in any home I
          buy, give or take.{" "}
          <a href="https://www.sfchronicle.com/realestate/article/when-homes-sell-20217490.php">
            It's about the median Bay Area home tenure
          </a>
          . That said, it's double the length of the average US home tenure, so
          this assumption favors buying a home. As with most of the arbitrary
          choices in this blog, if you don't like it, skip to the end and mess
          with it yourself.
        </p>{" "}
        <p>
          As you can see, 6% growth is the 5th percentile for S&amp;P 500
          returns. That's quite conservative, but it's a defensible choice. You
          should probably plan your finances assuming slow growth, because if
          growth goes well hopefully things will be pretty good no matter what
          you choose.
        </p>{" "}
        <p>So let's move on to housing. NerdWallet says:</p>{" "}
        <blockquote>
          {" "}
          <p>
            <strong>Home Price Appreciation:</strong> [The 4.5% default] is
            based on <em>[removed for dramatic effect]</em> national trends from
            the FHFA House Price Index.
          </p>{" "}
        </blockquote>{" "}
        <p>
          Great, so let's add the FHFA House Price Index to our graph. Same
          methodology: percentiles for every 20 year period.
        </p>{" "}
        <GrowthChart
          assets={[ASSETS.SP_500_INDEX, ASSETS.USSTHPI_PC1]}
          periodSize={20}
        />
        <p>
          Oh – so we're at the 67th percentile for housing. That feels super
          incongruous – why?
        </p>{" "}
        <blockquote>
          {" "}
          <p>
            <strong>Home Price Appreciation:</strong> [The 4.5% default] is
            based on <strong>recent</strong> national trends from the FHFA House
            Price Index.
          </p>{" "}
        </blockquote>{" "}
        <p>
          They're not specific on what/why, but I assume the main effect of this
          is to remove the 2008 financial crisis from the numbers. You can't
          really show "20 year periods after 2008" for obvious reasons, but it
          doesn't really matter: US home price growth has been remarkably
          consistent since then.
        </p>{" "}
        <GrowthChart
          assets={[ASSETS.USSTHPI_PC1]}
          periodSize={1}
          startYear={2014}
        />{" "}
        <p>
          That 4.5% number home price growth rate looks quite reasonable now.
          There's actually never been a year with below 4.6% growth post 2008
          recovery. But this is a pretty tenuous assumption — deciding to remove
          a crash without removing the following boom is a hard sell for me.
          This also doesn't give the same benefit to the S&amp;P 500, which also
          notably crashed in 2008. So what if we just look at pre-2008 data?
        </p>{" "}
        <GrowthChart
          assets={[ASSETS.SP_500_INDEX, ASSETS.USSTHPI_PC1]}
          periodSize={20}
          endYear={2007}
        />{" "}
        <p>
          In this view, NerdWallet's home price growth rate is the 25th
          percentile, and other asset growth rate is... half of the lowest 20
          year period that exists.
        </p>{" "}
        <h2>Stocks have risk, but homes are about as risky</h2>
        <p>NerdWallet raises a reasonable point in their email:</p>
        <blockquote>
          {" "}
          <p>
            <strong>Rate of Return:</strong> To clarify, the 6% default value is
            a conservative estimate compared to historic stock market returns —
            but it also assumes that some folks might choose other options to
            park their money, such as bonds, mutual/index funds, CDs or a
            high-yield savings account.
          </p>{" "}
        </blockquote>{" "}
        <p>
          The reason people do this is straightforward: the S&amp;P 500 is a lot
          more volatile than the housing index, and we should value
          stability/diversity over maximum growth. We are kind of doing that by
          looking at low percentiles, but maybe we should do it more?
        </p>{" "}
        <p>
          I'd be sympathetic to this argument, except for one major problem:
          when you buy a house, you're not buying a housing index. You're buying
          one single house. That's <strong>a lot</strong> more volatile than an
          index. Individual houses are{" "}
          <a href="https://www.nber.org/system/files/working_papers/w12036/w12036.pdf#:~:text=using%20OFHEO%20state%20level%20house,level%20housing%20returns">
            4x the volatility of a housing index
          </a>
          , close to{" "}
          <a href="https://www.fhfa.gov/sites/default/files/2023-03/wp1701.pdf#:~:text=others%2C%20who%20show%20using%20micro,returns%20to%20housing%3A%20why%20is">
            the same volatility as the stock market
          </a>
          . Given that similarity, I'd call being able to choose your own risk
          tolerance a benefit of other assets, not a downside, so I'm hesitant
          to lower it on that account. But it seems a single house is not quite
          as volatile as the market, so maybe adjusting stocks down a little to
          compensate makes sense, though probably not a lot.
          <Tooltip
            number={4}
            content="There's another reasonable argument here that buying a house *forces* you to invest your income, 
            and many are likely to spend money they aren't forced to invest. I don't find this argument compelling for me personally, 
            but your situation may be different."
          />
          <Tooltip
            number={5}
            content="It could be nice to visualize a typical basket of assets in these
          charts. It'd also be nice to apply a 'volatility adjustment' to the
          home index growth rates. I may come back to that in the future."
          />
        </p>{" "}
        <h2>Here Be Fat-Tailed Dragons</h2>
        <p>
          There's a lot of higher level arguments one could introduce here, less
          grounded in historical trends and more speculative. Maybe US
          historical stock growth is an aberration and we should regress it to
          the international mean,{" "}
          <a href="https://mebfaber.com/2020/01/10/the-case-for-global-investing/">
            about 5% in real terms
          </a>
          . Maybe housing prices are about to take off for some reason or
          another. Or maybe YIMBYs will win and housing prices will drop. I feel
          far less capable of making these judgments, and so I'm tempted to
          throw them into one big pile labeled "uncertainty", and call it a
          wash. But as with the volatility argument, uncertainty would trend me
          more towards not locking up my money in a single asset.
        </p>{" "}
        <p>
          These nice charts look very authoritative, but fundamentally there
          aren't that many 20 year periods to look at in the last 50ish years.
          And because those periods overlap a lot, the charts give the illusion
          of more data than they actually have. The future is very uncertain.
        </p>
        <h2>So I'm Probably Renting</h2>
        <p>
          After all that, I don't really have a principled take on exactly what
          percentile you should use, but it ends up not mattering a ton. My
          mostly arbitrary take is that looking at the historical 20th
          percentile probably makes sense as a starting point, which would be
          3.4% growth for housing and 7.9% growth for the S&amp;P 500.
        </p>{" "}
        <p>
          It's worth emphasizing again that the point here isn't that the S&P
          500 appreciates faster than homes; that's pretty uncontroversial. The
          point is that it does so{" "}
          <b>faster than the rent/buy calculators default to</b>, which means
          that they likely make buying look better than it is.
        </p>{" "}
        <p>
          On my own finances, plugging a plausible house price and financing
          that I would buy, changing these values and nothing else changes the
          rent/buy difference by more than $1.5M over 25 years (!!!). This,
          intuitively, feels like an implausibly large difference – so tell me,
          am I going wrong somewhere?
        </p>{" "}
        <p>
          This math has a huge impact on one of the most important decisions in
          my life (buying a house in the Bay Area), so I'm writing this post for
          a few reasons.
        </p>
        <ol>
          {" "}
          <li>
            Because{" "}
            <a href="https://paulgraham.com/writes.html">writing is thinking</a>
            , and this is a nice way to make my thinking concrete
          </li>{" "}
          <li>
            Because if I'm{" "}
            <a href="https://xkcd.com/386/">
              <em>Wrong on the Internet</em>
            </a>
            ™, hopefully someone will tell me and save me a bunch of money
          </li>{" "}
          <li>
            Because if I'm not, I think this is something other people could
            benefit from
          </li>{" "}
        </ol>{" "}
        <div id="interactive-growth" className="interactive-growth-chart">
          <h2 style={{ textAlign: "center" }}>
            Interactive Asset vs Housing Appreciation
          </h2>
          <InteractiveGrowthChart />
        </div>
      </main>
    </div>
  );
}

export default App;
