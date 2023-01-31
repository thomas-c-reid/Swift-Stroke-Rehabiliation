namespace SwiftUserManagement.Domain.Entities
{
    // Entity which is used for showing where the video data is stored
    public class Video
    {
        public int Video_Id { get; set; }
        public int User_Id { get; set; }
        public string Video_Name { get; set; }
        public string Weakness_Prediction { get; set; }
    }
}
