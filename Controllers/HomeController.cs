using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Idea.Models;

namespace Idea.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
{
    // Đường dẫn gốc tới thư mục file
    var rootDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "file");

    // Danh sách đường dẫn hình ảnh
    var imagePaths = new List<string>();

    // Kiểm tra nếu thư mục gốc tồn tại
    if (Directory.Exists(rootDirectory))
    {
        // Duyệt qua các thư mục submission
        foreach (var submissionDir in Directory.GetDirectories(rootDirectory, "submission_*"))
        {
            // Lấy submissionId từ tên thư mục (vd: submission_1 -> 1)
            var submissionId = int.Parse(Path.GetFileName(submissionDir).Replace("submission_", ""));

            // Duyệt qua các thư mục idea trong mỗi submission
            foreach (var ideaDir in Directory.GetDirectories(submissionDir, "idea_*"))
            {
                // Lấy ideaId từ tên thư mục (vd: idea_1 -> 1)
                var ideaId = int.Parse(Path.GetFileName(ideaDir).Replace("idea_", ""));

                // Lấy tất cả các tệp hình ảnh trong thư mục idea
                foreach (var file in Directory.GetFiles(ideaDir, "*.*", SearchOption.TopDirectoryOnly))
                {
                    // Chỉ lấy tệp hình ảnh (jpg, png, gif, ...)
                    if (file.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                        file.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                        file.EndsWith(".gif", StringComparison.OrdinalIgnoreCase))
                    {
                        // Chuyển đổi đường dẫn vật lý sang URL tương đối
                        var relativePath = Path.Combine("file", $"submission_{submissionId}", $"idea_{ideaId}", Path.GetFileName(file))
                            .Replace("\\", "/");
                        imagePaths.Add(relativePath);
                    }
                }
            }
        }
    }

    // Truyền danh sách đường dẫn hình ảnh vào ViewBag
    ViewBag.ImagePaths = imagePaths;

    return View();
}


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        
    }
}

