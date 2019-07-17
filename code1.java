import java.util.*;

public class guessaf {

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

    public static long maxx(HashSet<Long> set)
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

    public static void main(String[] args) {

//
        Scanner sc = new Scanner(System.in);

        int t = sc.nextInt();

        for(int i=0;i<t;t++){

            long x = 100000;

            System.out.println("1 "+x);

            long r1 = sc.nextLong();

            long n1 = (x*x) - r1 ;

            HashSet<Long> p = factorize(n1);

            long a = maxx(p);

            double root = Math.sqrt(a);

            System.out.println("1 "+ (long)Math.ceil(root));

            long r2 = sc.nextLong();
            long rc = (long)Math.ceil(root);
            long n2 = (rc*rc)-r2;

            HashSet<Long> q = factorize(n2);

            HashSet<Long> com = common(p , q);

            long c = maxx(com);

//            for(int e=p.size()-1;e>=0;e--){
//
//                for(int f=q.size()-1;f>=0;f--){
//
//                    if(p.get(e)==q.get(f)){
//                        c=p.get(e);
//                        break;
//                    }
//
//                }
//
//            }

            System.out.println("2 "+c);

            String s = sc.next();

            if(s.compareTo("No")==0){
                System.out.println("Error. Wrong guess");
                java.lang.System.exit(1);
            }


        }

    }
}