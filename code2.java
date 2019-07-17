public class Main
{
public static HashSet<Long> factorize(long number)
{
  HashSet<Long> set=new HashSet<>();
  long fixedNumber=number;

  long i=2;
  while(i*i<=fixedNumber&&number>1)
  {
    while(true)
    {
      if(number%i==0)
      {
        set.add(i);
        number=number/i;
      }
      else
      {
        break;
      }
    }
    i++;
  }
  if(set.size()==0)
  {
    set.add(fixedNumber);
  }
  else
  {
    if(number!=1)
    {
      set.add(number);
    }
  }
  return set;
}

public static HashSet<Long> common(HashSet<Long> set1,HashSet<Long> set2)
{
  HashSet<Long> setnew=new HashSet<>();
  Iterator<Long> iter=set1.iterator();
  int size1=set2.size();
  while(iter.hasNext())
  {
    long x=iter.next();
    set2.add(x);
    if(set2.size()==size1)
    {
      setnew.add(x);
    }
    else
    {
      size1=set2.size();
    }
  }
  return setnew;
}

public static long greatest(HashSet<Long> set)
{
  if(set.size()==0)
  {
    return -1;
  }
  Iterator<Long> iter=set.iterator();
  long max=0;
  while(iter.hasNext())
  {
    long z=iter.next();
    if(z>max)
    {
      max=z;
    }
  }
  return max;
}

public static void main(String[] args)throws IOException
{
    Reader.init(System.in);
    int T=Reader.nextInt();
    for(int i=0;i<T;i++)
    {
      long base=100000;
      System.out.println("1 "+base);
      long R1=Reader.nextInt();
      long N1=(base*base)-R1;
      HashSet<Long> set1=factorize(N1);

      long maxOfSet1=greatest(set1);

      Double root=Math.pow(maxOfSet1,0.5);
      long rootInt=(long)(Math.ceil(root));

      System.out.println("1 "+rootInt);

      long R2=Reader.nextInt();
      long N2=(rootInt*rootInt)-R2;
      HashSet<Long> set2=factorize(N2);
      HashSet<Long> setcommon=common(set1,set2);

      long left=greatest(setcommon);
      System.out.println("2 "+left);
      String finalw=Reader.next();
      if(finalw.compareTo("No")==0)
      {
        System.out.println("Error. Wrong guess");
        java.lang.System.exit(1);
      }
    }
}
}