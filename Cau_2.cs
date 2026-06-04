class Score
{
    public double Math { get; set; }
    public double Physic { get; set; }
    public double Chemistry { get; set; }

    public double Average => System.Math.Round((Math + Physic + Chemistry) / 3.0, 2);
}

class Student
{
    public string Name { get; set; }
    public Score Score { get; set; }
}

class Program
{
    // Merge sort: sắp xếp giảm dần theo điểm TB, bằng nhau thì tăng dần theo tên
    static void MergeSort(Student[] arr, int left, int right)
    {
        if (left >= right) return;

        int mid = (left + right) / 2;
        MergeSort(arr, left, mid);
        MergeSort(arr, mid + 1, right);
        Merge(arr, left, mid, right);
    }

    static void Merge(Student[] arr, int left, int mid, int right)
    {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        Student[] L = new Student[n1];
        Student[] R = new Student[n2];

        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        int a = 0, b = 0, k = left;
        while (a < n1 && b < n2)
        {
            double avgL = L[a].Score.Average;
            double avgR = R[b].Score.Average;

            bool takeLeft;
            if (Math.Abs(avgL - avgR) > 1e-9)
            {
                takeLeft = avgL > avgR;
            }
            else
            {
                // So sánh theo tên riêng (từ cuối) — quy ước tiếng Việt
                string givenL = L[a].Name.Split(' ')[^1];
                string givenR = R[b].Name.Split(' ')[^1];
                takeLeft = string.Compare(givenL, givenR, StringComparison.OrdinalIgnoreCase) <= 0;
            }

            arr[k++] = takeLeft ? L[a++] : R[b++];
        }

        while (a < n1) arr[k++] = L[a++];
        while (b < n2) arr[k++] = R[b++];
    }

    // Binary search tìm object có điểm TB bằng target (mảng đã sắp xếp giảm dần)
    // Trả về index đầu tiên tìm thấy, -1 nếu không có
    static int BinarySearch(Student[] arr, double target)
    {
        int low = 0, high = arr.Length - 1;
        while (low <= high)
        {
            int mid = (low + high) / 2;
            double avg = arr[mid].Score.Average;

            if (Math.Abs(avg - target) < 1e-9) return mid;
            else if (avg > target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    static void Main()
    {
        Student[] students = [
            new() { Name = "Nguyen Van Minh",   Score = new() { Math = 9.5, Physic = 8.5, Chemistry = 9.0 } },  // TB = 9.00
            new() { Name = "Tran Thi Lan",      Score = new() { Math = 8.0, Physic = 7.5, Chemistry = 9.5 } },  // TB = 8.33
            new() { Name = "Le Van Hung",       Score = new() { Math = 9.0, Physic = 9.5, Chemistry = 8.5 } },  // TB = 9.00
            new() { Name = "Pham Thi Hoa",      Score = new() { Math = 7.0, Physic = 8.0, Chemistry = 8.0 } },  // TB = 7.67
            new() { Name = "Hoang Van Tuan",    Score = new() { Math = 10,  Physic = 9.5, Chemistry = 9.5 } },  // TB = 9.67
            new() { Name = "Do Thi Mai",        Score = new() { Math = 8.5, Physic = 8.5, Chemistry = 8.0 } },  // TB = 8.33
            new() { Name = "Bui Van Duc",       Score = new() { Math = 6.5, Physic = 7.0, Chemistry = 7.5 } },  // TB = 7.00
            new() { Name = "Vo Thi Thu",        Score = new() { Math = 9.0, Physic = 8.0, Chemistry = 8.0 } },  // TB = 8.33
            new() { Name = "Dang Van Nam",      Score = new() { Math = 7.5, Physic = 7.0, Chemistry = 8.0 } },  // TB = 7.50
            new() { Name = "Ngo Thi Linh",      Score = new() { Math = 9.5, Physic = 9.5, Chemistry = 9.0 } },  // TB = 9.33
            new() { Name = "Dinh Van Khoa",     Score = new() { Math = 8.0, Physic = 8.5, Chemistry = 8.5 } },  // TB = 8.33
            new() { Name = "Ly Thi Yen",        Score = new() { Math = 7.0, Physic = 6.5, Chemistry = 7.5 } },  // TB = 7.00
            new() { Name = "Trinh Van Long",    Score = new() { Math = 8.5, Physic = 9.0, Chemistry = 8.5 } },  // TB = 8.67
            new() { Name = "Cao Thi Nga",       Score = new() { Math = 9.0, Physic = 9.0, Chemistry = 9.0 } },  // TB = 9.00
            new() { Name = "Duong Van Phuc",    Score = new() { Math = 7.5, Physic = 8.0, Chemistry = 7.5 } },  // TB = 7.67
            new() { Name = "Ha Thi Thuy",       Score = new() { Math = 8.0, Physic = 7.5, Chemistry = 8.5 } },  // TB = 8.00
            new() { Name = "Nguyen Thi Hien",   Score = new() { Math = 9.5, Physic = 8.5, Chemistry = 8.0 } },  // TB = 8.67
            new() { Name = "Tran Van Khanh",    Score = new() { Math = 7.0, Physic = 7.5, Chemistry = 8.5 } },  // TB = 7.67
            new() { Name = "Le Thi Nhung",      Score = new() { Math = 8.5, Physic = 8.0, Chemistry = 8.5 } },  // TB = 8.33
            new() { Name = "Pham Van Dat",      Score = new() { Math = 6.0, Physic = 7.0, Chemistry = 6.5 } },  // TB = 6.50
            new() { Name = "Vu Thi Kim",        Score = new() { Math = 9.0, Physic = 8.5, Chemistry = 9.5 } },  // TB = 9.00
            new() { Name = "Luu Van Son",       Score = new() { Math = 7.5, Physic = 8.5, Chemistry = 7.0 } },  // TB = 7.67
            new() { Name = "Truong Thi Bich",   Score = new() { Math = 8.0, Physic = 8.0, Chemistry = 8.0 } },  // TB = 8.00
            new() { Name = "Tong Van Quang",    Score = new() { Math = 9.5, Physic = 10,  Chemistry = 9.5 } },  // TB = 9.67
            new() { Name = "Mai Thi Phuong",    Score = new() { Math = 8.0, Physic = 8.5, Chemistry = 8.5 } },  // TB = 8.33
            new() { Name = "Lam Van Tai",       Score = new() { Math = 7.0, Physic = 6.5, Chemistry = 8.5 } },  // TB = 7.33
            new() { Name = "Nguyen Thi Xuan",   Score = new() { Math = 8.5, Physic = 9.0, Chemistry = 9.5 } },  // TB = 9.00
            new() { Name = "Tran Van Bao",      Score = new() { Math = 6.5, Physic = 7.5, Chemistry = 7.0 } },  // TB = 7.00
            new() { Name = "Le Van Cuong",      Score = new() { Math = 8.0, Physic = 7.5, Chemistry = 9.5 } },  // TB = 8.33
            new() { Name = "Hoang Thi Dieu",    Score = new() { Math = 9.0, Physic = 8.5, Chemistry = 8.5 } },  // TB = 8.67
        ];

        Console.WriteLine("=== Trước khi sắp xếp ===");
        foreach (var s in students)
            Console.WriteLine($"  {s.Name,-20} | TB: {s.Score.Average:F2}");

        MergeSort(students, 0, students.Length - 1);

        Console.WriteLine("\n=== Sau khi sắp xếp (TB giảm dần, tên tăng dần) ===");
        foreach (var s in students)
            Console.WriteLine($"  {s.Name,-20} | TB: {s.Score.Average:F2}");

        // Tìm học sinh có điểm TB = 8 bằng binary search
        double searchTarget = 8.00;
        int idx = BinarySearch(students, searchTarget);

        Console.WriteLine($"\n=== Tìm học sinh có điểm TB = {searchTarget} ===");
        if (idx == -1)
        {
            Console.WriteLine("  Không tìm thấy.");
        }
        else
        {
            var s = students[idx];
            Console.WriteLine($"  [{idx}] {s.Name} | Math={s.Score.Math} Physic={s.Score.Physic} Chemistry={s.Score.Chemistry}");
        }
    }
}
