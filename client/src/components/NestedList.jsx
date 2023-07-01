import { AiOutlineDown} from 'react-icons/ai';
import { forwardRef, useState } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';
import PropTypes from 'prop-types';

function NestedList({sendCode}){
  const [type, setType] = useState(true);


  const stock = [
    {key: 'Open Price', value: `const open = ${type?'stock':'preStock'}.open;`},
    {key: 'Close Price', value: `const close = ${type?'stock':'preStock'}.close;`},
    {key: 'High Price', value: `const high = ${type?'stock':'preStock'}.high;`},
    {key: 'Low Price', value: `const low = ${type?'stock':'preStock'}.low;`},
    {key: 'Price Spread', value: `const spread = ${type?'stock':'preStock'}.spread;`},
    {key: 'Rate of price spread', value: `const low = ${type?'stock':'preStock'}.spreadPCT;`},
    {key: 'Volume', value: `const volume = ${type?'stock':'preStock'}.trading_volume;`},

  ];
  
  const invertors = [
    {key: 'Foreign Investors', value: `const foreignInvestors = ${type?'stock':'preStock'}.foreign_investors;`},
    {key: 'Investment Trust', value: `const investmentTrust = ${type?'stock':'preStock'}.investment_trust;`},
    {key: 'Dealer Self', value: `const dealerSelf = ${type?'stock':'preStock'}.dealer_self;`},
  ];
  
  const taiex = [
      {key: 'Open Index', value: `const open = ${type?'taiex':'preTaiex'}.open;`},
      {key: 'Close Index', value: `const close = ${type?'taiex':'preTaiex'}.close;`},
      {key: 'High Index', value: `const high = ${type?'taiex':'preTaiex'}.high;`},
      {key: 'Low Index', value: `const low = ${type?'taiex':'preTaiex'}.low;`},
  ];

  const technical_indicators = [
    {key: 'MA5', value: `const open = ${type?'stock':'preStock'}.ma5;`},
    {key: 'MA10', value: `const close = ${type?'stock':'preStock'}.ma10;`},
    {key: 'MA20', value: `const high = ${type?'stock':'preStock'}.ma20;`},
    {key: 'KD', value: `const low = ${type?'kd':'preKD'}.k;`},

  ];

  return(
    <>
    <div className='flex gap-2 justify-center '>
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
        className="w-[250px] rounded-md shadow-[0_2px_10px] mt-1"
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
          {technical_indicators.map((key, i) => (<AccordionContent key={i} onClick={()=>sendCode(key?.value)} >  {key?.key}</AccordionContent>))}
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
        className="transition-transform duration-300 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

// eslint-disable-next-line react/display-name, react/prop-types
const AccordionContent = forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames(
      "text-[#BABCBC] cursor-pointer overflow-hidden text-[14px] bg-[#343435] hover:text-[#E7893C]",
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
