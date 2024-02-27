/*
List out the computational inefficiencies and anti-patterns found in the code block below:

- The getPriority function is placed inside the component, which is unnecessary as it does not depend on the component state or props.
 Additionally, since it is inside the component, it is re-created on every render, which is unnecessary and inefficient. 
 Therefore it could be moved outside the component.

- The function sortedBalanaces and formattedBalanaces maps over the balances array twice, which is inefficient.
This could be combined into a single iteration.

*/

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices() {
    try {
      const response = await fetch(this.url);
      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch prices");
    }
  }
}

interface Props extends BoxProps { }

// Moved outside because it does not depend on component state or props
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Combine sortedBalances and formattedBalances method
  const sortedAndFormattedBalances = useMemo(
    () =>
      balances
        .filter(
          (balance) =>
            balance.amount > 0 && getPriority(balance.blockchain) > -99
        )
        .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
        .map((balance) => ({
          ...balance,
          formatted: balance.amount.toFixed(),
        })),
    [balances, prices]
  );

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className= { classes.row }
        key = { index }
        amount = { balance.amount }
        usdValue = { usdValue }
        formattedAmount = { balance.formatted }
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
