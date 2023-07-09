import { AiOutlineDown} from 'react-icons/ai';
import { forwardRef, useState } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';
import PropTypes from 'prop-types';

const kdStrategy = `const close = stock.close;
const k = kd.k;

const buyCondition = k < 20;

if (buyCondition ) {
  action['buy'](close, 1)
}

const sellCondition = k > 80;

if (sellCondition ) {
  action['sell'](close, shares)
}
`;

const actionMap = ` /**
* fill in your condition in if ( )
* chang the stock priceType as you already declare 
* param{number} qty. In sell condition it shares(all stocks).
*/
if ( ) {
  action['buy']( priceType, qty);
}

if ( ) {
  action['sell']( priceType, shares);
}
`;

function NestedList({sendCode}){
  const [type, setType] = useState(true);


  const stock = [
    {key: 'Open Price', value: `const ${type?'open':'preOpen'} = ${type?'stock':'preStock'}.open;`},
    {key: 'Close Price', value: `const ${type?'close':'preClose'} = ${type?'stock':'preStock'}.close;`},
    {key: 'High Price', value: `const ${type?'high':'preHigh'} = ${type?'stock':'preStock'}.high;`},
    {key: 'Low Price', value: `const ${type?'low':'preLow'} = ${type?'stock':'preStock'}.low;`},
    {key: 'Price Spread', value: `const ${type?'spread':'preSpread'} = ${type?'stock':'preStock'}.spread;`},
    {key: 'Rate of price spread', value: `const ${type?'spreadPct':'preSpreadPct'} = ${type?'stock':'preStock'}.spreadPCT;`},
    {key: 'Volume', value: `const ${type?'volume':'preVolume'} = ${type?'stock':'preStock'}.trading_volume;`},

  ];
  
  const invertors = [
    {key: 'Foreign Investors', value: `const ${type?'foreignInvestors':'preForeignInvestors'}  = ${type?'stock':'preStock'}.foreign_investors;`},
    {key: 'Investment Trust', value: `const ${type?'investmentTrust':'preInvestmentTrust'} = ${type?'stock':'preStock'}.investment_trust;`},
    {key: 'Dealer Self', value: `const ${type?'dealerSelf':'preDealerSelf'} = ${type?'stock':'preStock'}.dealer_self;`},
  ];
  
  const taiex = [
      {key: 'Open Index', value: `const ${type?'openTaiex':'preOpenTaiex'} = ${type?'taiex':'preTaiex'}.open;`},
      {key: 'Close Index', value: `const ${type?'closeTaiex':'preCloseTaiex'} = ${type?'taiex':'preTaiex'}.close;`},
      {key: 'High Index', value: `const ${type?'highTaiex':'preHighTaiex'} = ${type?'taiex':'preTaiex'}.high;`},
      {key: 'Low Index', value: `const ${type?'lowTaiex':'preLowTaiex'} = ${type?'taiex':'preTaiex'}.low;`},
  ];

  const technicalIndicators = [
    {key: 'MA5', value: `const ${type?'ma5':'preMa5'} = ${type?'stock':'preStock'}.ma5;`},
    {key: 'MA10', value: `const ${type?'ma10':'preMa10'} = ${type?'stock':'preStock'}.ma10;`},
    {key: 'MA20', value: `const ${type?'ma20':'preMa20'} = ${type?'stock':'preStock'}.ma20;`},
    {key: 'KD', value: `const ${type?'k':'preKd'} = ${type?'kd':'preKD'}.k;`},
  ];

  const action = [
    {key: 'Buy & Sell', value: actionMap}
  ];

  const example = [
    {key: 'KD strategy', value: kdStrategy},
  ];
  return(
    <>
    <div className='flex gap-2'>
      <div className=' mt-1 rounded-md'>
        <div className={`flex items-center justify-center ${type?'text-[#E7893C]':'text-[#BABCBC]'} h-[36px] w-[100px]
         bg-[#1D1D1E] border border-[#1D1D1E] rounded-t-md hover:text-[#E7893C]
         shadow-[0_2px_10px] shadow-black cursor-pointer`}
         onClick={() => setType(true)}>
          <p>Current</p>
        </div>
        <div className={`flex items-center justify-center ${type?'text-[#BABCBC]':'text-[#E7893C]'} h-[36px] w-[100px]
         bg-[#1D1D1E] border border-[#1D1D1E] rounded-b-md hover:text-[#E7893C]
         shadow-[0_2px_10px] shadow-black cursor-pointer`}
         onClick={() => setType(false)}>
          <p>Previous</p>
        </div>
      </div>
      <Accordion.Root
        className="w-[250px] rounded-md shadow-[0_2px_10px] mt-1 duration-300"
        type="single"
        defaultValue="item-1"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Stock Info</AccordionTrigger>
          {stock.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >{key?.key}</AccordionContent>))}
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Institutional Investors </AccordionTrigger>
          {invertors.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >  {key?.key}</AccordionContent>))}
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Taiex Info</AccordionTrigger>
          {taiex.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >  {key?.key}</AccordionContent>))}
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Technical Indicators</AccordionTrigger>
          {technicalIndicators.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >  {key?.key}</AccordionContent>))}
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Action</AccordionTrigger>
          {action.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >  {key?.key}</AccordionContent>))}
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>Example Strategy</AccordionTrigger>
          {example.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >  {key?.key}</AccordionContent>))}
        </AccordionItem>

      </Accordion.Root>
    </div>
    </>
  )
}
// eslint-disable-next-line react/display-name, react/prop-types
const AccordionItem = forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Item
    className={classNames(
      'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));

// eslint-disable-next-line react/display-name, react/prop-types
const AccordionTrigger = forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={classNames(
        'group flex h-[36px] flex-1 cursor-default items-center justify-between text-[#BABCBC] bg-[#1D1D1E] px-5 text-[14px] leading-none outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <AiOutlineDown
        className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

// eslint-disable-next-line react/display-name, react/prop-types
const AccordionContent = forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames(
      "text-[#BABCBC] cursor-pointer data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[14px] bg-[#343435] hover:text-[#E7893C]",
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="py-[10px] px-5">{children}</div>
  </Accordion.Content>
));

NestedList.propTypes ={
  sendCode: PropTypes.func
}

export default NestedList;
